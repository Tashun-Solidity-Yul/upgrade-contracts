const { ethers, upgrades } = require('hardhat')
const { expect } = require('chai')
const hre = require('hardhat')
const {
    getProxyAdminFactory,
} = require('@openzeppelin/hardhat-upgrades/dist/utils')
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')

describe('Authoritative Token Tests', function () {
    let deployer, alice, bob

    // Pool has 1M * 10**18 tokens
    const TOKENS_IN_POOL = ethers.utils.parseEther('1000000')
    const INITIAL_ATTACKER_TOKEN_BALANCE = ethers.utils.parseEther('100')

    before(async function () {
        [deployer, alice, bob] = await ethers.getSigners()
        console.log(alice.address)




    })

    it('Transparent Proxy Deployment Test', async function () {
        const {
            ERC20Token,
            erc20ContractProxy,
            ERC721Token,
            erc721ContractProxy,
            AuthoritativeToken,
            authoritativeTokenProxy,
            ERC721WithGodMod
        } = await loadFixture(deployContractsWithTransparentProxyPattern)

        const erc721ContractProxyWithABISupport = await ERC721Token.attach(
            erc721ContractProxy.address,
        )
        const erc20ContractProxyWithABISupport = await ERC20Token.attach(
            erc20ContractProxy.address,
        )
        const authoritativeContractProxyWithABISupport = await AuthoritativeToken.attach(
            authoritativeTokenProxy.address,
        )
        // ------------------------------------------------------
        const tnx1 = await erc721ContractProxyWithABISupport
            .connect(deployer)
            .setupExecutiveRole(authoritativeTokenProxy.address)
        await tnx1.wait()

        // ------------------------------------------------------

        const tnx2 = await erc20ContractProxyWithABISupport
            .connect(deployer)
            .setupExecutiveRole(authoritativeTokenProxy.address)
        await tnx2.wait()

        console.log(await erc721ContractProxyWithABISupport.OWNER_ROLE())

        console.log(
            await erc721ContractProxyWithABISupport.getRoleAdmin(
                await authoritativeContractProxyWithABISupport.OWNER_ROLE(),
            ),
        )
        console.log(
            await erc721ContractProxyWithABISupport.hasRole(
                await authoritativeContractProxyWithABISupport.OWNER_ROLE(),
                deployer.address,
            ),
        )
        // ------------------------------------------------------
        // await erc721ContractProxyWithABISupport.mintNewNFTThroughContract(deployer.address)
        const tnx3 = await erc20ContractProxyWithABISupport
            .connect(deployer)
            .approve(authoritativeTokenProxy.address, 10n ** 17n)
        await tnx3.wait()

        // ------------------------------------------------------
        const tnx4 = await authoritativeContractProxyWithABISupport
            .connect(deployer)
            .mintNFT()
        await tnx4.wait()

        // ------------------------------------------------------
        await expect(
            erc721ContractProxyWithABISupport
                .connect(deployer)
                .mintNewNFTThroughContract(deployer.address),
        ).to.be.reverted
        // ------------------------------------------------------
        const tnx5 = await erc721ContractProxyWithABISupport.connect(deployer).approve(authoritativeContractProxyWithABISupport.address, 1)
        await tnx5.wait()

        // ------------------------------------------------------
        const tnx6 = await authoritativeContractProxyWithABISupport.depositNFT(1)
        await tnx6.wait()

        // ------------------------------------------------------

        const eRC721WithGodMod = await upgrades.upgradeProxy(erc721ContractProxy.address, ERC721WithGodMod);
        await eRC721WithGodMod.deployed();
        console.log("eRC721WithGodMod : " + eRC721WithGodMod.address)

        // ------------------------------------------------------
        const tnx7 = await authoritativeTokenProxy.connect(deployer).withdrawNFT(1)
        await tnx7.wait();

        // ------------------------------------------------------
        const tnx8 = await eRC721WithGodMod.connect(deployer).transferNFTs(deployer.address,alice.address,1);
        await tnx8.wait();
        // ------------------------------------------------------
        await expect(authoritativeTokenProxy.connect(deployer).withdrawNFT(1)).to.be.revertedWithCustomError(authoritativeTokenProxy,"TokenNotDeposited")

    })


    it('UUPS Proxy Deployment Test', async function () {
        const {
            ERC20TokenV2,
            erc20ContractProxyV2,
            ERC721TokenV2,
            erc721ContractProxyV2,
            AuthoritativeTokenV2,
            authoritativeTokenProxyV2,
            ERC721WithGodModV2
        } = await loadFixture(deployContractsWithUUPSProxyPattern)

        const erc721ContractProxyV2WithABISupport = await ERC721TokenV2.attach(
            erc721ContractProxyV2.address,
        )
        const erc20ContractProxyV2WithABISupport = await ERC20TokenV2.attach(
            erc20ContractProxyV2.address,
        )
        const authoritativeContractProxyV2WithABISupport = await AuthoritativeTokenV2.attach(
            authoritativeTokenProxyV2.address,
        )
        // ------------------------------------------------------
        const tnx1 = await erc721ContractProxyV2WithABISupport
            .connect(deployer)
            .setupExecutiveRole(authoritativeTokenProxyV2.address)
        await tnx1.wait()

        // ------------------------------------------------------

        const tnx2 = await erc20ContractProxyV2WithABISupport
            .connect(deployer)
            .setupExecutiveRole(authoritativeTokenProxyV2.address)
        await tnx2.wait()

        console.log(await erc721ContractProxyV2WithABISupport.OWNER_ROLE())

        console.log(
            await erc721ContractProxyV2WithABISupport.getRoleAdmin(
                await authoritativeContractProxyV2WithABISupport.OWNER_ROLE(),
            ),
        )
        console.log(
            await erc721ContractProxyV2WithABISupport.hasRole(
                await authoritativeContractProxyV2WithABISupport.OWNER_ROLE(),
                deployer.address,
            ),
        )
        // ------------------------------------------------------
        // await erc721ContractProxyWithABISupport.mintNewNFTThroughContract(deployer.address)
        const tnx3 = await erc20ContractProxyV2WithABISupport
            .connect(deployer)
            .approve(authoritativeTokenProxyV2.address, 10n ** 17n)
        await tnx3.wait()

        // ------------------------------------------------------
        const tnx4 = await authoritativeContractProxyV2WithABISupport
            .connect(deployer)
            .mintNFT()
        await tnx4.wait()

        // ------------------------------------------------------
        await expect(
            erc721ContractProxyV2WithABISupport
                .connect(deployer)
                .mintNewNFTThroughContract(deployer.address),
        ).to.be.reverted
        // ------------------------------------------------------
        const tnx5 = await erc721ContractProxyV2WithABISupport.connect(deployer).approve(authoritativeContractProxyV2WithABISupport.address, 1)
        await tnx5.wait()

        // ------------------------------------------------------
        const tnx6 = await authoritativeContractProxyV2WithABISupport.depositNFT(1)
        await tnx6.wait()

        // ------------------------------------------------------

        const eRC721WithGodModV2 = await upgrades.upgradeProxy(erc721ContractProxyV2.address, ERC721WithGodModV2);
        await eRC721WithGodModV2.deployed();
        console.log("eRC721WithGodMod : " + eRC721WithGodModV2.address)

        // ------------------------------------------------------
        const tnx7 = await authoritativeTokenProxyV2.connect(deployer).withdrawNFT(1)
        await tnx7.wait();

        // ------------------------------------------------------
        const tnx8 = await eRC721WithGodModV2.connect(deployer).transferNFTs(deployer.address,"0x70997970C51812dc3A010C7d01b50e0d17dc79C8",1);
        await tnx8.wait();
        // ------------------------------------------------------
        await expect(authoritativeTokenProxyV2.connect(deployer).withdrawNFT(1)).to.be.revertedWithCustomError(authoritativeTokenProxyV2,"TokenNotDeposited")

        const tnx9 = await eRC721WithGodModV2.connect(deployer).transferNFTs("0x70997970C51812dc3A010C7d01b50e0d17dc79C8",deployer.address,1);
        await tnx9.wait();
    })
    async function deployContractsWithTransparentProxyPattern() {
        const ERC20Token = await hre.ethers.getContractFactory(
            'ERC20Token',
            deployer,
        )
        const erc20ContractProxy = await hre.upgrades.deployProxy(
            ERC20Token,
            ['DUX', 'DUX', deployer.address, 100000],
            {
                initializer: 'initialize',
            },
        )
        await erc20ContractProxy.deployed()
        console.log('erc20ContractProxy : ' + erc20ContractProxy.address)

        const ERC721Token = await ethers.getContractFactory('ERC721Token', deployer)
        const erc721ContractProxy = await upgrades.deployProxy(
            ERC721Token,
            ['GAME', 'GAM', deployer.address],
            {
                initializer: 'initialize',
            },
        )
        await erc721ContractProxy.deployed()

        console.log('erc721ContractProxy : ' + erc721ContractProxy.address)

        const AuthoritativeToken = await ethers.getContractFactory(
            'AuthoritativeToken',
            deployer,
        )
        const authoritativeTokenProxy = await upgrades.deployProxy(
            AuthoritativeToken,
            [
                erc721ContractProxy.address,
                erc20ContractProxy.address,
                deployer.address,
            ],
            {
                initializer: 'initialize',
            },
        )
        await authoritativeTokenProxy.deployed()
        console.log('authoritativeToken : ' + authoritativeTokenProxy.address)
        // const erc721ContractProxy = "0xA734Da4C28D5ED383C0f6e9Fd152B7DCeC576837";
        const ERC721WithGodMod = await ethers.getContractFactory("ERC721WithGodMod");



        return {
            ERC20Token,
            erc20ContractProxy,
            ERC721Token,
            erc721ContractProxy,
            AuthoritativeToken,
            authoritativeTokenProxy,
            ERC721WithGodMod,
        }
    }

    async function deployContractsWithUUPSProxyPattern() {
        const ERC20TokenV2 = await hre.ethers.getContractFactory(
            'ERC20TokenV2',
            deployer,
        )
        const erc20ContractProxyV2 = await hre.upgrades.deployProxy(
            ERC20TokenV2,
            ['DUX', 'DUX', deployer.address, 100000],
            {
                initializer: 'initialize',
            },
        )
        await erc20ContractProxyV2.deployed()
        console.log('erc20ContractProxyV2 : ' + erc20ContractProxyV2.address)

        const ERC721TokenV2 = await ethers.getContractFactory('ERC721TokenV2', deployer)
        const erc721ContractProxyV2 = await upgrades.deployProxy(
            ERC721TokenV2,
            ['GAME', 'GAM', deployer.address],
            {
                initializer: 'initialize',
                kind: "uups"
            }
        )
        await erc721ContractProxyV2.deployed()

        console.log('erc721ContractProxyV2 : ' + erc721ContractProxyV2.address)

        const AuthoritativeTokenV2 = await ethers.getContractFactory(
            'AuthoritativeTokenV2',
            deployer,
        )
        const authoritativeTokenProxyV2 = await upgrades.deployProxy(
            AuthoritativeTokenV2,
            [
                erc721ContractProxyV2.address,
                erc20ContractProxyV2.address,
                deployer.address,
            ],
            {
                initializer: 'initialize',
            },
        )
        await authoritativeTokenProxyV2.deployed()
        console.log('authoritativeTokenV2 : ' + authoritativeTokenProxyV2.address)
        // const erc721ContractProxy = "0xA734Da4C28D5ED383C0f6e9Fd152B7DCeC576837";
        const ERC721WithGodModV2 = await ethers.getContractFactory("ERC721WithGodModV2");



        return {
            ERC20TokenV2,
            erc20ContractProxyV2,
            ERC721TokenV2,
            erc721ContractProxyV2,
            AuthoritativeTokenV2,
            authoritativeTokenProxyV2,
            ERC721WithGodModV2,
        }
    }
})
