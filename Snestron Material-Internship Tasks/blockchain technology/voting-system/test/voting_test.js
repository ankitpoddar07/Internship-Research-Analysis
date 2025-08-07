
const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
  it("should initialize with 3 candidates", async () => {
    const voting = await Voting.deployed();
    const count = await voting.candidates(0);
    assert.ok(count);
  });

  it("should allow a user to vote", async () => {
    const voting = await Voting.deployed();
    await voting.vote("Alice", { from: accounts[0] });
    const votes = await voting.getVotes("Alice");
    assert.equal(votes, 1);
  });

  it("should not allow double voting", async () => {
    const voting = await Voting.deployed();
    try {
      await voting.vote("Alice", { from: accounts[0] });
      assert.fail("Should not allow double voting");
    } catch (error) {
      assert.ok(/already voted/.test(error.message));
    }
  });
});
