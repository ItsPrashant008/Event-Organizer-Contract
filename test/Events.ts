import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Events Contract", () => {
  let owner: { address: any };
  let Token;
  let hardhartToken: Contract;
  let addr1: { address: any };
  let addr2;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    Token = await ethers.getContractFactory("Events");
    hardhartToken = await Token.deploy();
  });

  describe("Create Events", () => {
    it("Should Check events insert or not", async () => {
      await hardhartToken.createEvent("prashant", 1702116555, 10, 200);
      expect(await hardhartToken.indexing()).to.equal(1);
    });

    it("Should Check events value sames", async () => {
      await hardhartToken.createEvent("prashant", 1702116555, 10, 30);
      await hardhartToken.createEvent("raj", 1702116555, 5, 20);

      expect(await hardhartToken.events(1)).to.deep.equals([
        owner.address,
        "raj",
        ethers.BigNumber.from("1702116555"),
        ethers.BigNumber.from("5"),
        ethers.BigNumber.from("20"),
        ethers.BigNumber.from("20"),
      ]);
    });
  });

  describe("Buying Events", () => {
    it("Should buy tickets", async () => {
      await hardhartToken.createEvent("prashant", 1702116555, 30, 30);
      await hardhartToken.buyTicket(0, 4);

      expect(await hardhartToken.all_tickets(owner.address, 0)).to.equals(4);

      expect(await hardhartToken.events(0)).to.deep.equals([
        owner.address,
        "prashant",
        ethers.BigNumber.from("1702116555"),
        ethers.BigNumber.from("10"),
        ethers.BigNumber.from("30"),
        ethers.BigNumber.from("26"),
      ]);
    });

    it("Should transfer ticket to another person", async () => {
      await hardhartToken.createEvent("prashant", 1702116555, 30, 30);
      await hardhartToken.buyTicket(0, 4);
      expect(await hardhartToken.all_tickets(owner.address, 0)).to.equals(4);

      await hardhartToken.transferTicket(addr1.address, 0, 3);
      expect(await hardhartToken.all_tickets(addr1.address, 0)).to.equals(3);

      expect(await hardhartToken.events(0)).to.deep.equals([
        owner.address,
        "prashant",
        ethers.BigNumber.from("1702116555"),
        ethers.BigNumber.from("10"),
        ethers.BigNumber.from("30"),
        ethers.BigNumber.from("26"),
      ]);
    });
  });
});
