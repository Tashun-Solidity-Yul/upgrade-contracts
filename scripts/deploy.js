// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");

// import {ethers, upgrades }from "hardhat";
const { ethers, upgrades } = require('hardhat');

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();

  const ERC20Token = await ethers.getContractFactory("ERC20Token");
  // const erc20Contract = await ERC20Token.deploy();


  const ERC721Token = await ethers.getContractFactory("ERC721Token");
  // const erc721Contract = await ERC721Token.deploy();

  const AuthoritativeToken = await ethers.getContractFactory("AuthoritativeToken");
  // const authoritativeToken = await AuthoritativeToken.deploy();




  // console.log(erc20Contract.address)
  // const initErc20Contract = await erc20Contract.initialize("DUX", "DUX", 100000);
  // await initErc20Contract.wait()

  // console.log(erc721Contract.address)
  // const initErc721Contract = await erc721Contract.initialize("GAME", "GAM");

  // await initErc721Contract.wait()

  // console.log(authoritativeToken.address)
  // const initAuthoritativeToken = await authoritativeToken.initialize(erc20Contract.address, erc721Contract.address);
  // await initAuthoritativeToken.wait()
  const erc20Contract = await upgrades.deployProxy(ERC20Token, ["DUX", "DUX", 100000], {
    initializer: "initialize",
  });
  await erc20Contract.deployed()

  const erc721Contract = await upgrades.deployProxy(ERC721Token, ["GAME", "GAM"], {
    initializer: "initialize",
  });
  await erc721Contract.deployed()

  const authoritativeToken = await upgrades.deployProxy(AuthoritativeToken, [erc20Contract.address, erc721Contract.address], {
    initializer: "initialize",
  });
  await authoritativeToken.deployed()


  const ERC721WithGodMod = await ethers.getContractFactory("ERC721WithGodMod");
  // const eRC721WithGodMod = await ERC721WithGodMod.deploy();

  const eRC721WithGodMod = await upgrades.upgradeProxy(erc721Contract.address, ERC721WithGodMod);
  await eRC721WithGodMod.deployed();

  console.log(eRC721WithGodMod.address)
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
