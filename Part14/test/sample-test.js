const { expect, use } = require("chai");
const { ethers } = require("hardhat");

const { solidity } = require("ethereum-waffle");
use(solidity);

const DAIAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const CDAIAddress = "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643";

describe("DeFi", () => {
  let owner;
  let DAI_TokenContract;
  let CDAI_TokenContract;
  let DeFi_Instance;
  const INITIAL_AMOUNT = 999999999000000;
  before(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    const whale = await ethers.getSigner(
      "0x503828976D22510aad0201ac7EC88293211D23Da"
    );
    console.log("owner account is ", owner.address);

    DAI_TokenContract = await ethers.getContractAt("ERC20", DAIAddress);
    let symbol = await DAI_TokenContract.symbol();
    console.log(symbol);

    CDAI_TokenContract = await ethers.getContractAt("ERC20", CDAIAddress);
    symbol = await CDAI_TokenContract.symbol();
    console.log(symbol);

    const DeFi = await ethers.getContractFactory("DeFi");

    await DAI_TokenContract.connect(whale).transfer(
      owner.address,
      BigInt(INITIAL_AMOUNT)
    );

    DeFi_Instance = await DeFi.deploy();
  });

  it("should check transfer succeeded", async () => {
    let contractBalance = await DAI_TokenContract.balanceOf(owner.address);
    expect(contractBalance).to.be.equal(INITIAL_AMOUNT);
  });

  it("should sendDAI to contract", async () => {
    let tx = await DAI_TokenContract.transfer(DeFi_Instance.address, INITIAL_AMOUNT);
    tx.wait();

    let contractBalance = await DAI_TokenContract.balanceOf(DeFi_Instance.address);
    expect(contractBalance).to.be.equal(INITIAL_AMOUNT);
  });

  it("should get ETH price", async () => {
    let ethPrice = await DeFi_Instance.getETHPrice();
    expect(ethPrice.toNumber()).to.be.greaterThan(0);
    expect(ethPrice.toNumber() / 1e8).to.be.lessThan(10000); // I hope this test fails in 2022
  });

  it("should deposit into compound", async () => {
    let contractBalance = await CDAI_TokenContract.balanceOf(DeFi_Instance.address);
    expect(contractBalance).to.be.equal(0);

    let tx = await DeFi_Instance.addToCompound(INITIAL_AMOUNT);
    tx.wait();

    // contract balance should be non-zero after deposit
    contractBalance = await CDAI_TokenContract.balanceOf(DeFi_Instance.address);
    expect(contractBalance.toNumber()).to.be.greaterThan(0);
  });
});