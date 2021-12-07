const { expect, use } = require("chai");
const { ethers } = require("hardhat");
const { constants, expectRevert } = require("@openzeppelin/test-helpers");

const { solidity } = require("ethereum-waffle");
use(solidity);

// Useful links for chai and waffle:
// https://www.chaijs.com/guide/styles/
// https://ethereum-waffle.readthedocs.io/en/latest/matchers.html

describe("VolcanoCoin", () => {
  let volcanoContract;
  let owner, addr1, addr2, addr3;

  beforeEach(async () => {
    const Volcano = await ethers.getContractFactory("VolcanoCoin");
    volcanoContract = await Volcano.deploy();
    await volcanoContract.deployed();

    [owner, addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("has a name", async () => {
    let contractName = await volcanoContract.name();
    expect(contractName).to.equal("Volcano Coin");
  });

  it("reverts when transferring tokens to the zero address", async () => {
    await expectRevert(
      volcanoContract.transfer(constants.ZERO_ADDRESS, 10),
      "ERC20: transfer to the zero address"
    );
  });

  //homework
  it("has a symbol", async () => {
    let contractSymbol = await volcanoContract.symbol();
    expect(contractSymbol).to.equal("VLC");
  });

  it("has 18 decimals", async () => {
    let decimals = await volcanoContract.decimals();
    expect(decimals).to.equal(18);
  });

  it("assigns initial balance", async () => {
    let ownerBalance = await volcanoContract.balanceOf(owner.address);
    expect(ownerBalance).to.equal(100000);
  });

  it("increases allowance for address1", async () => {
    await volcanoContract.increaseAllowance(addr1.address, 10);
    let allowance = await volcanoContract.allowance(owner.address, addr1.address);
    expect(allowance.toNumber()).to.equal(10);
  });

  it("decreases allowance for address1", async () => {
    await volcanoContract.increaseAllowance(addr1.address, 20);
    await volcanoContract.decreaseAllowance(addr1.address, 10);
    let allowance = await volcanoContract.allowance(owner.address, addr1.address);
    expect(allowance.toNumber()).to.equal(10);
  });

  it("emits an event when increasing allowance", async () => {
    let tx = await volcanoContract.increaseAllowance(addr1.address, 10);
    await expect(tx).to.emit(volcanoContract, "Approval");
  });

  it("reverts decreaseAllowance when trying decrease below 0", async () => {
    await expect(volcanoContract.decreaseAllowance(addr1.address, 10)).to.be.reverted;
  });

  it("updates balances on successful transfer from owner to addr1", async () => {
    let amountToTransfer = 50;
    let ownerBalanceBefore = await volcanoContract.balanceOf(owner.address);
    let tx = await volcanoContract.transfer(addr1.address, amountToTransfer);
    await tx.wait();

    let ownerBalanceAfter = await volcanoContract.balanceOf(owner.address);
    expect(ownerBalanceBefore - amountToTransfer).to.equal(ownerBalanceAfter);

    let addr1BalanceAfter = await volcanoContract.balanceOf(addr1.address);
    expect(amountToTransfer).to.equal(addr1BalanceAfter);
  });
  
  it("reverts transfer when sender does not have enough balance", async () => {
    let tx = volcanoContract.connect(addr1).transfer(addr2.address, 10);
    await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  it("reverts transferFrom addr1 to addr2 called by the owner without setting allowance", async () => {
    let tx = volcanoContract.connect(owner).transferFrom(addr1.address, addr2.address, 10);
    await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  it("updates balances after transferFrom addr1 to addr2 called by the owner", async () => {
    const transferAmount = 100;
    let tx = await volcanoContract.transfer(addr1.address, transferAmount);
    await tx.wait();
    let balance = await volcanoContract.balanceOf(addr1.address);
    expect(balance).to.equal(transferAmount);

    tx = await volcanoContract.connect(addr1).increaseAllowance(owner.address, transferAmount);
    await tx.wait();

    tx = await volcanoContract.transferFrom(addr1.address, addr2.address, transferAmount);
    await tx.wait();

    balance = await volcanoContract.balanceOf(addr1.address);
    await tx.wait();
    expect(balance).to.equal(0);

    balance = await volcanoContract.balanceOf(addr2.address);
    await tx.wait();
    expect(balance).to.equal(transferAmount);
  });
});
