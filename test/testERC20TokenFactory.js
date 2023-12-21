var { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
var { expect } = require("chai");
var { ethers } = require("hardhat");

// npx hardhat test .\test\testERC20TokenFactory.js

describe("Testing Factory ERC20Token", function () {
    async function deployFactory() {
        const [owner, alice] = await ethers.getSigners();
        const erc20TokenFactory = await ethers.deployContract("ERC20TokenFactory");
        return { erc20TokenFactory: erc20TokenFactory, owner, alice };
    }

    describe("ERC20Token Operations", function () {
        it("Create ERC20Token", async function () {
            const { erc20TokenFactory, owner, alice } = await loadFixture(deployFactory);
            var tx = await erc20TokenFactory.createNewERC20Token('CoiniToken', 'CTK', ethers.parseEther("1500"));
            var count = await erc20TokenFactory.erc20TokenCount();
            var index = Number(count) - 1;
            await expect(tx).to.emit(erc20TokenFactory, "NewERC20Token").withArgs(await erc20TokenFactory.erc20TokenArray(index), index);
        });

        it("Validate ERC20Token address", async function () {
            const { erc20TokenFactory, owner, alice } = await loadFixture(deployFactory);
            await erc20TokenFactory.createNewERC20Token('CoiniToken', 'CTK', ethers.parseEther("1500"));
            var count = await erc20TokenFactory.erc20TokenCount();
            var index = Number(count) - 1;
            var erc20Contract = await ethers.getContractAt('ERC20Token', await erc20TokenFactory.erc20TokenArray(index));
            expect(await erc20Contract.getAddress()).to.be.equal(await erc20TokenFactory.erc20TokenArray(index));
        });

        it("Validate ERC20Token balance", async function () {
            const { erc20TokenFactory, owner, alice } = await loadFixture(deployFactory);
            await erc20TokenFactory.createNewERC20Token('CoiniToken', 'CTK', ethers.parseEther("1500"));
            var count = await erc20TokenFactory.erc20TokenCount();
            var index = Number(count) - 1;
            var erc20Contract = await ethers.getContractAt('ERC20Token', await erc20TokenFactory.erc20TokenArray(index));
            var balance = await erc20TokenFactory.callBalanceOf(index, await erc20TokenFactory.getAddress());
            expect(balance).to.be.equal(await erc20Contract.totalSupply());
        });
    });
});