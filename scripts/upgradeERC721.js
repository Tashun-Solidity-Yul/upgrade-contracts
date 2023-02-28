// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");

// import {ethers, upgrades }from "hardhat";
const { ethers, upgrades } = require('hardhat');

// npx hardhat run .\scripts\deployERC721.js --network goreli
// npx hardhat verify --network goreli 0x869fffdbd019bd9d5ce45f7430c4cbf2bee406a8
async function main() {
    const erc721ContractProxy = "0xA734Da4C28D5ED383C0f6e9Fd152B7DCeC576837";
    const ERC721WithGodMod = await ethers.getContractFactory("ERC721WithGodMod");

    const eRC721WithGodMod = await upgrades.upgradeProxy(erc721ContractProxy.address, ERC721WithGodMod);
    await eRC721WithGodMod.deployed();


}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
