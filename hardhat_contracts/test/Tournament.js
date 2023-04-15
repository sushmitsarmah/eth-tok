const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Tournament", function () {
    let Tournament;
    let tournament;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        Tournament = await ethers.getContractFactory("Tournament");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        tournament = await Tournament.deploy();
    });

    it("Should create a tournament", async function () {
        const initialName = "Test Tournament";
        const initialType = "Single Elimination";
        const initialBuyIn = ethers.utils.parseEther("1");

        await expect(tournament.connect(addr1).createTournament(initialName, initialType, initialBuyIn, { value: initialBuyIn }))
            .to.emit(tournament, "TournamentCreated")
            .withArgs(1, initialName, initialType, initialBuyIn);

        const createdTournament = await tournament.tournaments(1);
        expect(createdTournament.name).to.equal(initialName);
        expect(createdTournament.tournamentType).to.equal(initialType);
        expect(createdTournament.buyInAmount).to.equal(initialBuyIn);
        expect(createdTournament.totalPool).to.equal(initialBuyIn);
        expect(createdTournament.ended).to.equal(false);
    });

    it("Should post a question", async function () {
        const initialName = "Test Tournament";
        const initialType = "Single Elimination";
        const initialBuyIn = ethers.utils.parseEther("1");
        await tournament.connect(addr1).createTournament(initialName, initialType, initialBuyIn, { value: initialBuyIn });

        const questionText = "Is this a test question?";
        const answer = true;
        await tournament.postQuestion(1, questionText, answer);

        await expect(tournament.postQuestion(1, questionText, answer))
            .to.emit(tournament, "QuestionPosted")
            .withArgs(1, 1, questionText);

        const postedQuestion = await tournament.questions(1);
        expect(postedQuestion.questionText).to.equal(questionText);
        expect(postedQuestion.answer).to.equal(answer);
    });

    it("Should allow users to answer questions", async function () {
        const initialName = "Test Tournament";
        const initialType = "Single Elimination";
        const initialBuyIn = ethers.utils.parseEther("1");
        await tournament.connect(addr1).createTournament(initialName, initialType, initialBuyIn, { value: initialBuyIn });

        const questionText = "Is this a test question?";
        const answer = true;
        await tournament.postQuestion(1, questionText, answer);

        await tournament.connect(addr1).answerQuestion(1, true);
        const question = await tournament.questions(1);
        expect(question.yesCount).to.equal(1);
        expect(question.noCount).to.equal(0);
    });

    it("Should end a tournament", async function () {
        const initialName = "Test Tournament";
        const initialType = "Single Elimination";
        const initialBuyIn = ethers.utils.parseEther("1");
        await tournament.connect(addr1).createTournament(initialName, initialType, initialBuyIn, { value: initialBuyIn });
        const questionText = "Is this a test question?";
        const answer = true;
        await tournament.postQuestion(1, questionText, answer);

        await tournament.endTournament(1);
        await expect(tournament.endTournament(1)).to.be.revertedWith("Tournament has already ended.");

        const endedTournament = await tournament.tournaments(1);
        expect(endedTournament.ended).to.equal(true);
    });
});


// This test script includes four tests to check the basic functionality of the Tournament contract:

// 1. Create a tournament.
// 2. Post a question.
// 3. Allow users to answer questions.
// 4. End a tournament.

// Remember to modify your `hardhat.config.js` file to include the necessary plugins and configurations, such as the Hardhat Waffle plugin and ethers.js library.

// Also, note that the test script does not cover every aspect of the contract. You should create additional tests to ensure the contract works as expected.
