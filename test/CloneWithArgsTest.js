const {ethers, upgrades} = require('hardhat')
const {expect} = require('chai')
const hre = require('hardhat')
const {
    getProxyAdminFactory,
} = require('@openzeppelin/hardhat-upgrades/dist/utils')
const {loadFixture} = require('@nomicfoundation/hardhat-network-helpers')

describe('Authoritative Token Tests', function () {
    let deployer, alice, bob

    // Pool has 1M * 10**18 tokens
    const TOKENS_IN_POOL = ethers.utils.parseEther('1000000')
    const INITIAL_ATTACKER_TOKEN_BALANCE = ethers.utils.parseEther('100')

    it('Exploit', async function () {
        const {StringTestBaseContract, stringTestBaseContractInstance} = await loadFixture(deployContracts);
        const tnx1 = await stringTestBaseContractInstance.stringSizeTest("FDC");
        await tnx1.wait();
    })

    async function deployContracts() {
        const StringTestBaseContract = await hre.ethers.getContractFactory(
            'StringTest',
            deployer,
        )
        const stringTestBaseContractInstance = await StringTestBaseContract.deploy()


        return {
            StringTestBaseContract,
            stringTestBaseContractInstance

        }
    }
})
