var { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
var { expect } = require("chai");
var { ethers } = require("hardhat");

// npx hardhat test .\test\testFactoryERC20.js

describe("Testing Factory ERC20Token", function () {
    async function deployFactory() {
        const [owner, alice] = await ethers.getSigners();
        const factoryERC20Contract = await ethers.deployContract("FactoryERC20Token");
        return { factoryERC20Contract, owner, alice };
    }

    describe("ERC20Token Operations", function () {
        it("Create ERC20Token", async function () {
            const { factoryERC20Contract, owner, alice } = await loadFixture(deployFactory);
            var tx = await factoryERC20Contract.CreateNewERC20Token('CoiniToken', 'CTK', ethers.parseEther("1500"));
            var count = await factoryERC20Contract.countERC20Token();
            var index = Number(count) - 1;
            await expect(tx).to.emit(factoryERC20Contract, "NewERC20TokenContract").withArgs(await factoryERC20Contract.erc20TokenArray(index), index);
        });

        it("Validate ERC20Token address", async function () {
            const { factoryERC20Contract, owner, alice } = await loadFixture(deployFactory);
            await factoryERC20Contract.CreateNewERC20Token('CoiniToken', 'CTK', ethers.parseEther("1500"));
            var count = await factoryERC20Contract.countERC20Token();
            var index = Number(count) - 1;
            var erc20Contract = await ethers.getContractAt('ERC20Token', await factoryERC20Contract.erc20TokenArray(index));
            expect(await erc20Contract.getAddress()).to.be.equal(await factoryERC20Contract.erc20TokenArray(index));
        });

        it("Validate ERC20Token balance", async function () {
            const { factoryERC20Contract, owner, alice } = await loadFixture(deployFactory);
            await factoryERC20Contract.CreateNewERC20Token('CoiniToken', 'CTK', ethers.parseEther("1500"));
            var count = await factoryERC20Contract.countERC20Token();
            var index = Number(count) - 1;
            var erc20Contract = await ethers.getContractAt('ERC20Token', await factoryERC20Contract.erc20TokenArray(index));
            var balance = await factoryERC20Contract.callBalanceOf(index, await factoryERC20Contract.getAddress());
            expect(balance).to.be.equal(await erc20Contract.totalSupply());
        });
    });
});