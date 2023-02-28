// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");

// import {ethers, upgrades }from "hardhat";
const { ethers, upgrades } = require('hardhat');
const hre = require("hardhat");

// npx hardhat run .\scripts\deployERC721.js --network goreli
// npx hardhat verify --network goreli 0x869fffdbd019bd9d5ce45f7430c4cbf2bee406a8
async function upgradeERC271TokenUsingTransparentProxy() {
    const [signer] = await hre.ethers.getSigners()

    const erc721ContractProxy = "0x53c10175cFf64a3b88C0c769432CEbfAAB709779";
    // const erc721ContractProxy = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const ERC721WithGodMod = await ethers.getContractFactory("ERC721WithGodMod");

    const eRC721WithGodMod = await upgrades.upgradeProxy(erc721ContractProxy, ERC721WithGodMod);
    await eRC721WithGodMod.deployed();

    console.log("Upgraded eRC721WithGodMod to : " + eRC721WithGodMod.address)

    const tnx8 = await eRC721WithGodMod.connect(signer).transferNFTs(signer.address,"0x752e4c6Cf51Cf1e4752E47B18794146586FEE09d",1);
    await tnx8.wait();


}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
upgradeERC271TokenUsingTransparentProxy().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
