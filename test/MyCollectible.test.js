const { assert } = require('chai');

const MyCollectible = artifacts.require("MyCollectible");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('MyCollectible', (accounts) => {
    let contract

    before(async () => {
        contract = await MyCollectible.deployed()
    })

    describe('deployment', async () => {
        it('deploys successful', async () => {
            const address = contract.address
            assert.notEqual(address, '')
            assert.notEqual(address, 0x0)
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
        it('has a name', async () => {
            const name = await contract.name()
            assert.equal(name, 'MyCollectible')
        })
        it('it has symbol', async () => {
            const symbol = await contract.symbol()
            assert.equal(symbol,'MCO')
        })
    })

    describe('Minting', async () => {

        it('create a new token', async () => {
            // SUCCESS
            const result = await contract.mint('#000000')
            const event = result.logs[0].args;
            assert.equal(event.tokenId.toNumber(),1,'Id is correct')
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event.to, accounts[0], 'to is correct')

            // FAILURE : can not mint twice
            await contract.mint('#000000').should.be.rejected;
        })
    })

    describe('indexing', async () => {
        
        it('list collectible', async () => {
            // mint more colletible 
            await contract.mint('#000001')
            await contract.mint('#000002')
            await contract.mint('#000003')

            const numberOfCollectible = await contract.lengthReturn()

            let collectible
            let result = []

            for (var i = 1; i <= numberOfCollectible; i++) {
                collectible = await contract.collectibles[i]
                result.push(collectible)
            }

            let expected = ['#000000','#000001','#000002','#000003']
            assert(result.join(',') , expected.join(',') , ' same element')
        })
    })
})