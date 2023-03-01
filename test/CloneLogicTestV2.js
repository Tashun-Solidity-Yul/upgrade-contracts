const {ethers, upgrades} = require('hardhat')
const {expect} = require('chai')
const hre = require('hardhat')
const {
    getProxyAdminFactory,
} = require('@openzeppelin/hardhat-upgrades/dist/utils')
const {loadFixture} = require('@nomicfoundation/hardhat-network-helpers')

describe('Clone Logic Test with constructor', function () {
    let deployer, alice, bob

    // Pool has 1M * 10**18 tokens
    const TOKENS_IN_POOL = ethers.utils.parseEther('1000000')
    const INITIAL_ATTACKER_TOKEN_BALANCE = ethers.utils.parseEther('100')

    it('Exploit', async function () {
        [deployer, alice, bob] = await ethers.getSigners();
        const BaseContract = await hre.ethers.getContractFactory("ECR20BaseTokenV2")
        const contractInstance = await BaseContract.deploy();

        const FactoryBaseContract = await hre.ethers.getContractFactory("ERC20CloneFactoryV2")
        const factoryContractInstance = await FactoryBaseContract.deploy(contractInstance.address);

        const tnx1 = await factoryContractInstance.createClone(40000n * 10n * 18n)
        const receipt = await tnx1.wait();
        const firstEvent = (receipt.events.filter((event) => {
            return event?.topics[0] === '0x1a0f921ce3c6f2f0f6be5b624a487bc1d5143e1fd1833154f39ab63e13d89755'
        }))[0]

        const clonedContract = await BaseContract.attach(firstEvent.args[0]);
        await clonedContract.initialize("FGF","DFG")
        expect(await contractInstance.getConstantSupply()).to.be.equal(0);
        expect(await clonedContract.getConstantSupply()).to.be.equal(40000n * 10n * 18n);



    })
})
