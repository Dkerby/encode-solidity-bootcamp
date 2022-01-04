const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Gas1", function () {
  let gasContract;
  let owner, addr1, addr2, addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
  
    const Gas1 = await ethers.getContractFactory("GasContract");
    let admins = [
      "0x3243Ed9fdCDE2345890DDEAf6b083CA4cF0F68f2",
      "0x2b263f55Bf2125159Ce8Ec2Bb575C649f822ab46",
      "0x0eD94Bc8435F3189966a49Ca1358a55d871FC3Bf",
      "0xeadb3d065f8d15cc05e92594523516aD36d1c834",
      owner.address
    ]
    gasContract = await Gas1.deploy(admins, 10000);
    await gasContract.deployed();

  });
  it("Check that admins have been added", async function () {
 
    expect(await gasContract.administrators(0)).to.equal('0x3243Ed9fdCDE2345890DDEAf6b083CA4cF0F68f2');
    expect(await gasContract.administrators(1)).to.equal('0x2b263f55Bf2125159Ce8Ec2Bb575C649f822ab46');
    expect(await gasContract.administrators(2)).to.equal('0x0eD94Bc8435F3189966a49Ca1358a55d871FC3Bf');
    expect(await gasContract.administrators(3)).to.equal('0xeadb3d065f8d15cc05e92594523516aD36d1c834');
    expect(await gasContract.administrators(4)).to.equal(owner.address);
  });
  it("Checks that the total supply is 10000", async function () {
    let supply = await gasContract.totalSupply();
     expect(supply).to.equal(10000);
  });
  it("Checks a transfer", async function () {
    // owner has total supply, transfer 100

    const transferTx = await gasContract.transfer(addr1.address,100,"acc1");
    await transferTx.wait();
    let acc1Balance = await gasContract.balanceOf(addr1.address);
     expect(acc1Balance).to.equal(100);
  });

  it("Checks an update", async function () {
    // create a transfer then update

    const transferTx1 = await gasContract.transfer(addr1.address,300,"acc1");
    await transferTx1.wait();
    const transferTx2 = await gasContract.transfer(addr1.address,200,"acc1");
    await transferTx2.wait();
    const transferTx3 = await gasContract.transfer(addr1.address,100,"acc1");
    await transferTx3.wait();
    const transferTx4 = await gasContract.transfer(addr2.address,300,"acc2");
    await transferTx4.wait();
    const transferTx5 = await gasContract.transfer(addr2.address,100,"acc2");
    await transferTx5.wait();
    let acc1Balance = await gasContract.balanceOf(addr1.address);
    expect(acc1Balance).to.equal(600);
    let acc2Balance = await gasContract.balanceOf(addr2.address);
    expect(acc2Balance).to.equal(400);
    const updateTx = await gasContract.updatePayment(owner.address,1,302, 3);
    await updateTx.wait();
    // now need to check the update
    const Payments = await gasContract.getPayments(owner.address);

    expect(Payments.length).to.equal(5);
    expect(Payments[0].amount).to.equal(302);
    expect(Payments[0].paymentType).to.equal(3);
  });

  it("Checks for events", async function () {
    // create a transfer then update
  await expect(gasContract.transfer(addr1.address,300,"acc1"))
  .to.emit(gasContract, 'Transfer')
  .withArgs(addr1.address,300);
  });

  it("Checks for admin", async function () {
  await expect(gasContract.connect(addr1).updatePayment(owner.address,1,302, 3))
  .to.be.reverted
  });
  it("Ensure trading mode is set", async function () {
    let mode = await gasContract.getTradingMode();
    expect(mode).to.equal(true);
  });
});