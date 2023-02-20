// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");

// import {ethers, upgrades }from "hardhat";
const hre = require('hardhat')
const { ethers, upgrades } = require('hardhat');
// authoritativeToken : 0xaEB84da89F8654Be192FA59289Ba6BbFa340a71E
// npx hardhat run .\scripts\deployAuthoritativeToken.js --network goreli
// npx hardhat verify --network goreli 0xeB71f489CF795BEcD8Cdd3A0AFDf45307F087561

async function main() {

  const erc20ContractProxyAddress= "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  const erc721ContractProxyAddress= "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
  const AuthoritativeToken = await ethers.getContractFactory("AuthoritativeToken");


  const authoritativeToken = await upgrades.deployProxy(AuthoritativeToken, [erc20ContractProxyAddress, erc721ContractProxyAddress], {
    initializer: "initialize",
  });
  await authoritativeToken.deployed()
  console.log("authoritativeToken : " + authoritativeToken.address);

  // const ERC721WithGodMod = await ethers.getContractFactory("ERC721WithGodMod");
  //
  // const eRC721WithGodMod = await upgrades.upgradeProxy(erc721ContractProxy.address, ERC721WithGodMod);
  // await eRC721WithGodMod.deployed();

}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
