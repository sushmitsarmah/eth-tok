// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.9;

import "@uma/core/contracts/optimistic-oracle-v2/interfaces/OptimisticOracleInterface.sol";
import "@uma/core/contracts/common/interfaces/ExpandedIERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {ISuperfluid, ISuperToken, ISuperApp} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";

error Unauthorized();

contract Tournament {
    uint256 private tournamentCounter;
    uint256 private questionCounter;
    uint256 private constant CHARGE_PERCENT = 4;

    // Address of the UMA Optimistic Oracle on the Ethereum mainnet
    address private constant OPTIMISTIC_ORACLE_ADDRESS =
        0x3dDB1C1281e683224B0C2D7F9c13Fe8b7Bf22eC0;
    // Address of the collateral token (e.g., DAI stablecoin)
    address private constant COLLATERAL_TOKEN_ADDRESS =
        0x6B175474E89094C44Da98b954EedeAC495271d0F;
    // Custom identifier for your contract; it should be unique for each question
    bytes32 private constant IDENTIFIER = keccak256("Tournament");
    // Price request timestamp
    uint256 private constant TIMESTAMP = 1;
    // Maximum time for the dispute period, in seconds
    uint256 private constant CUSTOM_LIVENESS = 60 * 60 * 24; // 24 hours

    struct TournamentData {
        string name;
        string tournamentType;
        uint256 buyInAmount;
        uint256 totalPool;
        uint256 questionCount;
        bool ended;
    }

    struct Question {
        string questionText;
        bool answer;
        uint256 yesCount;
        uint256 noCount;
    }

    /// @notice CFA Library.
    using SuperTokenV1Library for ISuperToken;

    mapping(uint256 => TournamentData) public tournaments;
    mapping(uint256 => Question) public questions;
    mapping(uint256 => mapping(address => bool)) public userAnswers;

    event TournamentCreated(
        uint256 indexed tournamentId,
        string name,
        string tournamentType,
        uint256 buyInAmount
    );
    event QuestionPosted(
        uint256 indexed questionId,
        uint256 indexed tournamentId,
        string questionText
    );
    event TournamentEnded(uint256 indexed tournamentId);

    function createTournament(
        string memory _name,
        string memory _tournamentType,
        uint256 _buyInAmount
    ) public payable {
        require(msg.value == _buyInAmount, "Buy-in amount not met.");

        tournamentCounter++;
        uint256 newTournamentId = tournamentCounter;
        tournaments[newTournamentId] = TournamentData(
            _name,
            _tournamentType,
            _buyInAmount,
            msg.value,
            0,
            false
        );

        emit TournamentCreated(
            newTournamentId,
            _name,
            _tournamentType,
            _buyInAmount
        );
    }

    function postQuestion(
        uint256 _tournamentId,
        string memory _questionText
    ) public {
        require(
            !tournaments[_tournamentId].ended,
            "Tournament has already ended."
        );

        questionCounter++;
        uint256 newQuestionId = questionCounter;
        tournaments[_tournamentId].questionCount++;

        // Request price from the Optimistic Oracle
        OptimisticOracleInterface optimisticOracle = OptimisticOracleInterface(
            OPTIMISTIC_ORACLE_ADDRESS
        );
        optimisticOracle.requestPrice(
            IDENTIFIER,
            TIMESTAMP,
            getAncillaryData(_questionText),
            IERC20(COLLATERAL_TOKEN_ADDRESS),
            CUSTOM_LIVENESS
        );

        emit QuestionPosted(newQuestionId, _tournamentId, _questionText);
    }

    function answerQuestion(uint256 _questionId, bool _answer) public {
        require(
            !userAnswers[_questionId][msg.sender],
            "User has already answered this question."
        );
        userAnswers[_questionId][msg.sender] = true;

        if (_answer) {
            questions[_questionId].yesCount++;
        } else {
            questions[_questionId].noCount++;
        }
    }

    function endTournament(uint256 _tournamentId) public {
        require(
            !tournaments[_tournamentId].ended,
            "Tournament has already ended."
        );
        tournaments[_tournamentId].ended = true;

        uint256 totalPool = tournaments[_tournamentId].totalPool;
        uint256 chargeAmount = (totalPool * CHARGE_PERCENT) / 100;
        uint256 remainingPool = totalPool - chargeAmount;

        // Code to distribute the remainingPool to the players based on their scores.

        emit TournamentEnded(_tournamentId);
    }

    // Helper function to generate ancillary data from the question text
    function getAncillaryData(
        string memory _questionText
    ) public pure returns (bytes memory) {
        return abi.encodePacked(_questionText);
    }

    // Resolves the answer for a specific question from the Optimistic Oracle
    function resolveAnswer(uint256 _questionId) public {
        require(
            questions[_questionId].questionText.length > 0,
            "Question does not exist."
        );

        // Get the resolved price from the Optimistic Oracle
        OptimisticOracleInterface optimisticOracle = OptimisticOracleInterface(
            OPTIMISTIC_ORACLE_ADDRESS
        );
        int256 resolvedPrice = optimisticOracle.settleAndGetPrice(
            IDENTIFIER,
            TIMESTAMP,
            getAncillaryData(questions[_questionId].questionText)
        );

        // Update the question's answer based on the resolved price
        if (resolvedPrice == 1) {
            questions[_questionId].answer = true;
        } else {
            questions[_questionId].answer = false;
        }
    }

    /// @notice Send a lump sum of super tokens into the contract.
    /// @dev This requires a super token ERC20 approval.
    /// @param token Super Token to transfer.
    /// @param amount Amount to transfer.
    function sendLumpSumToContract(ISuperToken token, uint256 amount) external {
        if (!accountList[msg.sender] && msg.sender != owner)
            revert Unauthorized();

        token.transferFrom(msg.sender, address(this), amount);
    }

    /// @notice Create a stream into the contract.
    /// @dev This requires the contract to be a flowOperator for the msg sender.
    /// @param token Token to stream.
    /// @param flowRate Flow rate per second to stream.
    function createFlowIntoContract(
        ISuperToken token,
        int96 flowRate
    ) external {
        if (!accountList[msg.sender] && msg.sender != owner)
            revert Unauthorized();

        token.createFlowFrom(msg.sender, address(this), flowRate);
    }

    /// @notice Update an existing stream being sent into the contract by msg sender.
    /// @dev This requires the contract to be a flowOperator for the msg sender.
    /// @param token Token to stream.
    /// @param flowRate Flow rate per second to stream.
    function updateFlowIntoContract(
        ISuperToken token,
        int96 flowRate
    ) external {
        if (!accountList[msg.sender] && msg.sender != owner)
            revert Unauthorized();

        token.updateFlowFrom(msg.sender, address(this), flowRate);
    }

    /// @notice Delete a stream that the msg.sender has open into the contract.
    /// @param token Token to quit streaming.
    function deleteFlowIntoContract(ISuperToken token) external {
        if (!accountList[msg.sender] && msg.sender != owner)
            revert Unauthorized();

        token.deleteFlow(msg.sender, address(this));
    }

    /// @notice Withdraw funds from the contract.
    /// @param token Token to withdraw.
    /// @param amount Amount to withdraw.
    function withdrawFunds(ISuperToken token, uint256 amount) external {
        if (!accountList[msg.sender] && msg.sender != owner)
            revert Unauthorized();

        token.transfer(msg.sender, amount);
    }

    /// @notice Create flow from contract to specified address.
    /// @param token Token to stream.
    /// @param receiver Receiver of stream.
    /// @param flowRate Flow rate per second to stream.
    function createFlowFromContract(
        ISuperToken token,
        address receiver,
        int96 flowRate
    ) external {
        if (!accountList[msg.sender] && msg.sender != owner)
            revert Unauthorized();

        token.createFlow(receiver, flowRate);
    }

    /// @notice Update flow from contract to specified address.
    /// @param token Token to stream.
    /// @param receiver Receiver of stream.
    /// @param flowRate Flow rate per second to stream.
    function updateFlowFromContract(
        ISuperToken token,
        address receiver,
        int96 flowRate
    ) external {
        if (!accountList[msg.sender] && msg.sender != owner)
            revert Unauthorized();

        token.updateFlow(receiver, flowRate);
    }

    /// @notice Delete flow from contract to specified address.
    /// @param token Token to stop streaming.
    /// @param receiver Receiver of stream.
    function deleteFlowFromContract(
        ISuperToken token,
        address receiver
    ) external {
        if (!accountList[msg.sender] && msg.sender != owner)
            revert Unauthorized();

        token.deleteFlow(address(this), receiver);
    }
}
