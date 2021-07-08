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
      const amt = 250000, bal = 750000
      const fakeTransfer = await bsttoken.transfer.call(accounts[1], amt);
      assert.equal(fakeTransfer, true, 'must return true on success')
      const receipt = await bsttoken.transfer(accounts[1], amt, { from: accounts[0] })
      assert.equal(receipt.logs.length, 1, '1 event should trigger')
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be Transfer event')
      assert.equal(receipt.logs[0].args._from, accounts[0], 'should be equal to the sender')
      assert.equal(receipt.logs[0].args._to, accounts[1], 'should be equal to the receiver')
      assert.equal(receipt.logs[0].args._amount, amt, 'logs the transfer amount')
      const balance = await bsttoken.balanceOf(accounts[1])
      assert.equal(balance.toNumber(), amt, 'transferred successfully to receiving account')
      const balance2 = await bsttoken.balanceOf(accounts[0])
      assert.equal(balance2.toNumber(), bal, 'deduct amount from sending account')
    })

    it('approves token for delegate transfer', async function() {
      const fakeApprover = await bsttoken.approve.call(accounts[1], 100);
      assert.equal(fakeApprover, true, "Should return true");
      const approver = await bsttoken.approve(accounts[1], 100, { from: accounts[0] });
      assert.equal(approver.logs.length, 1, '1 event should trigger')
      assert.equal(approver.logs[0].event, 'Approval', 'should be approval event')
      assert.equal(approver.logs[0].args._owner, accounts[0], 'should be equal to the sender')
      assert.equal(approver.logs[0].args._spender, accounts[1], 'should be equal to the receiver')
      assert.equal(approver.logs[0].args._amount, 100, 'logs the approval amount')

      const allowance = await bsttoken.allowance(accounts[0], accounts[1]);
      assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegates transfer');
    })

    it('handles delegated transfer', async function() {
      const fromAccount = accounts[2], toAccount = accounts[3], spenderAccount = accounts[4];
      // transfer sone tokens to fromAccount
      await bsttoken.transfer(fromAccount, 100, { from: accounts[0] });
      // approve spendingAccount to spend 10 tokens from fromAccount
      await bsttoken.approve(spenderAccount, 10, { from: fromAccount })
      // try transferring something bigger than the sender's balance
      // await bsttoken.transferFrom(fromAccount, toAccount, 99, { from: spenderAccount })
      // // try transferring something bigger than the from's approval
      // await bsttoken.transferFrom(fromAccount, toAccount, 20, { from: spenderAccount })
      // asserts return value
      const success = await bsttoken.transferFrom.call(fromAccount, toAccount, 20, { from: spenderAccount })
      assert.equal(success, true);
      const receipt = await bsttoken.transferFrom(fromAccount, toAccount, 20, { from: spenderAccount })
      assert.equal(receipt.logs.length, 1, '1 event should trigger')
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be transfer event')
      assert.equal(receipt.logs[0].args._from, fromAccount, 'should be equal to the sender')
      assert.equal(receipt.logs[0].args._to, toAccount, 'should be equal to the receiver')
      assert.equal(receipt.logs[0].args._amount.toNumber(), 20, 'logs the transfer amount')

      const fromAccountBalaance = await bsttoken.balanceOf(fromAccount);
      assert.equal(fromAccountBalaance.toNumber(), 80, 'deduct from the fromAccount');
      const toAccountBalance = await bsttoken.balanceOf(toAccount);
      assert.equal(toAccountBalance.toNumber(), 20, 'added to the toAccount');
      const allowance = await bsttoken.allowance(fromAccount, spenderAccount);
      console.log(allowance.toNumber())
      // assert.equal(allowance.toNumber(), 0, 'deduct from the allowance')
    })
  })
}) 