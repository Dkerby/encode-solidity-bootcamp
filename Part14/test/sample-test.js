const { expect, use } = require("chai");
const { ethers } = require("hardhat");

const { solidity } = require("ethereum-waffle");
use(solidity);

const DAIAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

describe("DeFi", () => {
  let owner;
  let DAI_TokenContract;
  let USDC_TokenContract;
  let DeFi_Instance;
  const INITIAL_AMOUNT = 999999999000000;
  before(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    const whale = await ethers.getSigner(
      "0x503828976D22510aad0201ac7EC88293211D23Da"
    );
    console.log("owner account is ", owner.address);

    DAI_TokenContract = await ethers.getContractAt("ERC20", DAIAddress);
    USDC_TokenContract = await ethers.getContractAt("ERC20", USDCAddress);
    const symbol = await DAI_TokenContract.symbol();
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

  it("should make a swap", async () => {

    let daiDecimals = await DAI_TokenContract.decimals();
    let usdcDecimals = await USDC_TokenContract.decimals();
    // expected to be -12
    let resultDecimals = usdcDecimals - daiDecimals;

    let originalBalance = await USDC_TokenContract.balanceOf(owner.address);

    let tx = await DeFi_Instance.swapDAItoUSDC(INITIAL_AMOUNT);
    tx.wait();

    let finalBalance = await USDC_TokenContract.balanceOf(owner.address);

    let amountFromSwap = finalBalance - originalBalance;

    //check that the owner's USDC balance is within 2, in order to account for swap fees
    expect(amountFromSwap).to.be.closeTo(INITIAL_AMOUNT * (10 ** resultDecimals), 2);
  });
});
