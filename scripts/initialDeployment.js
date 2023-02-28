// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");

// import {ethers, upgrades }from "hardhat";
const hre = require('hardhat');
const {getProxyAdminFactory} = require("@openzeppelin/hardhat-upgrades/dist/utils");
const {ethers, upgrades} = require("hardhat");
// const {getAdminAddress} = require("@openzeppelin/upgrades-core");

// npx hardhat run .\scripts\deployERC20.js --network goreli
// npx hardhat verify --network goreli 0xd3b00625ab66fbe9a2ad9cd4b751de91ec413bc5
async function main() {
    const [signer] = await hre.ethers.getSigners()

    const ERC20Token = await hre.ethers.getContractFactory("ERC20Token", signer);
    const erc20ContractProxy = await hre.upgrades.deployProxy(ERC20Token, ["DUX", "DUX", signer.address, 100000], {
        initializer: "initialize",
    });
    await erc20ContractProxy.deployed();
    console.log("erc20ContractProxy : " + erc20ContractProxy.address);

    // const adminAddress =await upgrades.erc1967.getAdminAddress(erc20ContractProxy.address)
    const AdminFactory = await getProxyAdminFactory(hre, signer);
    const adminAddress =await hre.upgrades.erc1967.getAdminAddress(erc20ContractProxy.address)
    const implementationAddressAddress =await hre.upgrades.erc1967.getImplementationAddress(erc20ContractProxy.address)
    const adminContract = AdminFactory.attach(adminAddress)
    // await adminContract.upgradeAndCall(implementationAddressAddress)
    // const adminAddress = await getAdminAddress(provider, proxyAddress);
    console.log(adminAddress);

    const ERC721Token = await ethers.getContractFactory("ERC721Token",signer);
    const erc721ContractProxy = await upgrades.deployProxy(ERC721Token, ["GAME", "GAM", signer.address], {
        initializer: "initialize",
    });
    await erc721ContractProxy.deployed()

    console.log("erc721ContractProxy : " + erc721ContractProxy.address);


    const AuthoritativeToken = await ethers.getContractFactory("AuthoritativeToken",signer);
    const authoritativeToken = await upgrades.deployProxy(AuthoritativeToken, [erc721ContractProxy.address, erc20ContractProxy.address], {
        initializer: "initialize",
    });
    await authoritativeToken.deployed()
    console.log("authoritativeToken : " + authoritativeToken.address);

    const erc721ContractProxyWithABISupport = await ERC721Token.attach(erc721ContractProxy.address);
    const erc20ContractProxyWithABISupport = await ERC20Token.attach(erc20ContractProxy.address);

    const tnx1 = await erc721ContractProxyWithABISupport.connect(signer).setupExecutiveRole(authoritativeToken.address);
    await tnx1.wait()
    const tnx2 = await erc20ContractProxyWithABISupport.connect(signer).setupExecutiveRole(authoritativeToken.address);
    await tnx2.wait()

    await hre.run("verify:verify", {
          address: contract.address,
          constructorArguments: [
            "0xa6Acf3140FD82957F8d8e81fFAD8f6f78Ca13E89", 1000, "0xFF84a7fbbBA12D039418592768FCa6Ae9FE90DcB",
            "0x360663D506032507dfB85963bfD2A461C07C12B8", 1000000000000000,  10000000
          ],
      
        });



}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
