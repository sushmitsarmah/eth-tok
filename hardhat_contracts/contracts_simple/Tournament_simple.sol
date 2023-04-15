// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.9;

contract TournamentSimple {
    uint256 private tournamentCounter;
    uint256 private questionCounter;
    uint256 private constant CHARGE_PERCENT = 4;

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

    mapping(uint256 => TournamentData) public tournaments;
    mapping(uint256 => Question) public questions;
    mapping(uint256 => mapping(address => bool)) public userAnswers;

    event TournamentCreated(uint256 indexed tournamentId, string name, string tournamentType, uint256 buyInAmount);
    event QuestionPosted(uint256 indexed questionId, uint256 indexed tournamentId, string questionText);
    event TournamentEnded(uint256 indexed tournamentId, uint256 totalPool, uint256 remainingPool);

    function createTournament(string memory _name, string memory _tournamentType, uint256 _buyInAmount) public payable {
        require(msg.value == _buyInAmount, "Buy-in amount not met.");

        tournamentCounter++;
        uint256 newTournamentId = tournamentCounter;
        tournaments[newTournamentId] = TournamentData(_name, _tournamentType, _buyInAmount, msg.value, 0, false);

        emit TournamentCreated(newTournamentId, _name, _tournamentType, _buyInAmount);
    }

    function postQuestion(uint256 _tournamentId, string memory _questionText, bool _answer) public {
        require(!tournaments[_tournamentId].ended, "Tournament has already ended.");

        questionCounter++;
        uint256 newQuestionId = questionCounter;
        tournaments[_tournamentId].questionCount++;
        questions[newQuestionId] = Question(_questionText, _answer, 0, 0);

        emit QuestionPosted(newQuestionId, _tournamentId, _questionText);
    }

    function answerQuestion(uint256 _questionId, bool _answer) public {
        require(!userAnswers[_questionId][msg.sender], "User has already answered this question.");
        userAnswers[_questionId][msg.sender] = true;

        if (_answer) {
            questions[_questionId].yesCount++;
        } else {
            questions[_questionId].noCount++;
        }
    }

    function endTournament(uint256 _tournamentId) public {
        require(!tournaments[_tournamentId].ended, "Tournament has already ended.");
        tournaments[_tournamentId].ended = true;

        uint256 totalPool = tournaments[_tournamentId].totalPool;
        uint256 chargeAmount = (totalPool * CHARGE_PERCENT) / 100;
        uint256 remainingPool = totalPool - chargeAmount;

        // Code to distribute the remainingPool to the players based on their scores.

        emit TournamentEnded(_tournamentId, totalPool, remainingPool);
    }
}
