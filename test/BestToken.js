const BestToken = artifacts.require('./BestToken.sol');
let bsttoken;

contract('BestToken', async function(accounts) {
  describe('BEST TOKEN', async function() {
    before(async () => {
      bsttoken = await BestToken.deployed();
    })
    
    it('sets the total supply upon deployment', async function() {
      const totalSupply = await bsttoken.totalSupply();
      assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to be 1,000,000');
    })
  })
})