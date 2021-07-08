const BestToken = artifacts.require('./BestToken.sol');
let bsttoken;

contract('BestToken', async function(accounts) {
  before(async () => {
    bsttoken = await BestToken.deployed();
  })

  describe('initialises the contract with the correct values', async function() {
    it('name is correct', async function() {
      const name = await bsttoken.name();
      assert.equal(name, 'Best token', 'the name is equivalent');
    })

    it('symbol is correct', async function() {
      const symbol = await bsttoken.symbol();
      assert.equal(symbol, 'BST', 'the symbol is equivalent');
    })

    it('standard is correct', async function() {
      const standard = await bsttoken.standard();
      assert.equal(standard, 'Best token v1.0', 'the standard is equivalent');
    })
  })

  describe('BEST TOKEN', async function() {
    it('sets the total supply upon deployment', async function() {
      const totalSupply = await bsttoken.totalSupply();
      assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to be 1,000,000');
    })

    it('initialise initial supply to the admin account', async function() {
      const adminBalance = await bsttoken.balanceOf(accounts[0]);
      assert.equal(adminBalance.toNumber(), 1000000, 'sets admin balance to the total supply');
    })

    it('transfer token', async function() {
      const fakeTransfer = await bsttoken.transfer.call(accounts[1], 250000);
      assert.equal(fakeTransfer, true, 'must return true on success')
      const receipt = await bsttoken.transfer(accounts[1], 250000, { from: accounts[0] })
      assert.equal(receipt.logs.length, 1, '1 event should trigger')
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be Transfer event')
      assert.equal(receipt.logs[0].args._from, accounts[0], 'should be equal to the sender')
      assert.equal(receipt.logs[0].args._to, accounts[1], 'should be equal to the receiver')
      assert.equal(receipt.logs[0].args._amount, 250000, 'logs the transfer amount')
      const balance = await bsttoken.balanceOf(accounts[1])
      assert.equal(balance.toNumber(), 250000, 'transferred successfully to receiving account')
      const balance2 = await bsttoken.balanceOf(accounts[0])
      assert.equal(balance2.toNumber(), 750000, 'deduct amount from sending account')
    })
  })
}) 