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
// const {getAdminAddress} = require("@openzeppelin/upgrades-core");

// npx hardhat run .\scripts\deployERC20.js --network goreli
// npx hardhat verify --network goreli 0xd3b00625ab66fbe9a2ad9cd4b751de91ec413bc5
async function main() {
  const [signer] = await hre.ethers.getSigners()
  console.log(signer.address)
  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token", signer);
  const erc20ContractProxy = await hre.upgrades.deployProxy(ERC20Token, ["DUX", "DUX", signer.address, 100000], {
    initializer: "initialize",
  });
  await erc20ContractProxy.deployed();
  console.log("erc20ContractProxy : " + erc20ContractProxy.address);

  // await hre.run("verify:verify", {
  //      address: erc20ContractProxy.address,
  //    });


}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
