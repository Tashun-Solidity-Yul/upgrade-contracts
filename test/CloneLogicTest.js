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
        [deployer, alice, bob] = await ethers.getSigners();
        const BaseContract = await hre.ethers.getContractFactory("ECR20BaseToken")
        // const contractInstance = await BaseContract.deploy("SLOW", "SLF", 100n * 10n * 18n);
        // const contractInstance = await BaseContract.deploy(100n * 10n * 18n);
        const contractInstance = await BaseContract.deploy();
        // await contractInstance.initialize("ASD","HS",deployer.address,1000n*10n*18n)
        // await contractInstance.setupExecutiveRole(deployer.address)

        const FactoryBaseContract = await hre.ethers.getContractFactory("ERC20CloneFactory")
        const factoryContractInstance = await FactoryBaseContract.deploy(contractInstance.address);
        //
        // const tnx1 = await factoryContractInstance.createClone("HELLO", "HTL", 10000n * 10n * 18n)
        const tnx1 = await factoryContractInstance.createClone(10000n * 10n * 18n)
        const receipt = await tnx1.wait();
        const firstEvent = (receipt.events.filter((event) => {
            return event?.topics[0] === '0x1a0f921ce3c6f2f0f6be5b624a487bc1d5143e1fd1833154f39ab63e13d89755'
        }))[0]

        // console.log(firstEvent.args[0])
        //
        const clonedContract = await BaseContract.attach(firstEvent.args[0]);
        await clonedContract.initialize("FGF","DFG",deployer.address,1000n*10n*18n)
        await clonedContract.setupExecutiveRole(deployer.address)
        console.log(await contractInstance.name())
        console.log(await clonedContract.name())

        const tnx2 = await factoryContractInstance.createClone(10000n * 10n * 18n)
        const receipt1 = await tnx2.wait();
        const firstEvent1 = (receipt1.events.filter((event) => {
            return event?.topics[0] === '0x1a0f921ce3c6f2f0f6be5b624a487bc1d5143e1fd1833154f39ab63e13d89755'
        }))[0]

        // console.log(firstEvent.args[0])
        //
        const clonedContract1 = await BaseContract.attach(firstEvent1.args[0]);
        await clonedContract1.initialize("FGFS","DFGH",deployer.address,1000n*10n*18n)
        await clonedContract1.setupExecutiveRole(deployer.address)
        console.log(await contractInstance.name())
        console.log(await clonedContract1.name())

    })
})
