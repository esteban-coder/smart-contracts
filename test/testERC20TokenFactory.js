var { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
var { expect } = require("chai");
var { ethers } = require("hardhat");

// npx hardhat test .\test\testERC20TokenFactory.js

describe("Testing Factory ERC20Token", function () {
    async function deployFactory() {
        const [owner, alice, bob] = await ethers.getSigners();
        const erc20TokenFactory = await ethers.deployContract("ERC20TokenFactory");
        return { erc20TokenFactory: erc20TokenFactory, owner, alice, bob };
    }

    describe("ERC20Token Operations", function () {
        it("Create ERC20Token", async function () {
            const { erc20TokenFactory, owner, alice } = await loadFixture(deployFactory);
            var tx = await erc20TokenFactory.createNewERC20Token('CoiniToken', 'CTK', ethers.parseEther("1500"));
            const response = await tx.wait();
            const address = response.logs[0].address;
            // console.log(tx);
            // console.log(response);
            // console.log(address);
            
            // var count = await erc20TokenFactory.erc20TokenCount();
            // var index = Number(count) - 1;
            // await expect(tx).to.emit(erc20TokenFactory, "NewERC20Token").withArgs(await erc20TokenFactory.erc20TokenArray(index), index);

            // const tokensArr = await erc20TokenFactory.getAllERC20Tokens();
            // console.log(tokensArr);
            
            // console.log(typeof tokensArr);
            // console.log(typeof [1,2,3,4,5]);
            // console.log([1,2,3,4,5].findIndex((element)=>{
            //     if(element===3)
            //         return true;
            // }));
           
            const index = (await erc20TokenFactory.getAllERC20Tokens()).findIndex((element)=>{
                if(element===address)
                    return true;
            });
            // console.log(index);

            await expect(tx).to.emit(erc20TokenFactory, "NewERC20Token").withArgs(address, index);

        });

        it("Validate ERC20Token address", async function () {
            const { erc20TokenFactory, owner, alice } = await loadFixture(deployFactory);
            const tx = await erc20TokenFactory.createNewERC20Token('CoiniToken', 'CTK', ethers.parseEther("1500"));
            const response = await tx.wait();
            const address = response.logs[0].address;

            // var count = await erc20TokenFactory.erc20TokenCount();
            // var index = Number(count) - 1;
            // var erc20Token = await ethers.getContractAt('ERC20Token', await erc20TokenFactory.erc20TokenArray(index));
            // expect(await erc20Token.getAddress()).to.be.equal(await erc20TokenFactory.erc20TokenArray(index));

            const index = (await erc20TokenFactory.getAllERC20Tokens()).findIndex((element)=>{
                if(element===address)
                    return true;
            });

            var erc20Token = await ethers.getContractAt('ERC20Token', address);
            expect(await erc20Token.getAddress()).to.be.equal(await erc20TokenFactory.erc20TokenArray(index));
        });

        it("Validate ERC20Token balance", async function () {
            const { erc20TokenFactory, owner, alice } = await loadFixture(deployFactory);
            const tx = await erc20TokenFactory.createNewERC20Token('CoiniToken', 'CTK', ethers.parseEther("1500"));
            const response = await tx.wait();
            const address = response.logs[0].address;

            // var count = await erc20TokenFactory.erc20TokenCount();
            // var index = Number(count) - 1;
            // var erc20Token = await ethers.getContractAt('ERC20Token', await erc20TokenFactory.erc20TokenArray(index));
            // var balance = await erc20TokenFactory.callBalanceOf(index, await erc20TokenFactory.getAddress());

            var erc20Token = await ethers.getContractAt('ERC20Token', address);
            var balance = await erc20TokenFactory.callERC20TokenBalanceOf(address, await erc20TokenFactory.getAddress());

            expect(balance).to.be.equal(await erc20Token.totalSupply());
        });

        it("Validate ERC20Token mint", async function () {
            const { erc20TokenFactory, owner, alice } = await loadFixture(deployFactory);
            const tx = await erc20TokenFactory.createNewERC20Token('CoiniToken', 'CTK', ethers.parseEther("1500"));
            const response = await tx.wait();
            const address = response.logs[0].address;

            var erc20Token = await ethers.getContractAt('ERC20Token', address);
            await erc20TokenFactory.callERC20TokenMint(address, await alice.getAddress(), ethers.parseEther("250"));

            var balanceFactory = await erc20TokenFactory.callERC20TokenBalanceOf(address, await erc20TokenFactory.getAddress());
            var balanceOwner = await erc20TokenFactory.callERC20TokenBalanceOf(address, await owner.getAddress());
            var balanceAlice = await erc20TokenFactory.callERC20TokenBalanceOf(address, await alice.getAddress());

            // console.log(balanceFactory);
            // console.log(balanceOwner);
            // console.log(balanceAlice);

            expect(balanceFactory + balanceAlice).to.be.equal(await erc20Token.totalSupply());
        });

        it("Validate ERC20Token transfer from Factory", async function () {
            const { erc20TokenFactory, owner, alice, bob } = await loadFixture(deployFactory);
            const tx = await erc20TokenFactory.createNewERC20Token('CoiniToken', 'CTK', ethers.parseEther("1500"));
            const response = await tx.wait();
            const address = response.logs[0].address;

            var erc20Token = await ethers.getContractAt('ERC20Token', address);

            // Error: contract runner does not support sending transactions
            // await erc20Token.connect(await erc20TokenFactory.getAddress()).transfer(await bob.getAddress(), ethers.parseEther("85"));

            await erc20TokenFactory.callERC20TokenTransfer(address, bob, ethers.parseEther("85"));

            var balanceFactory = await erc20TokenFactory.callERC20TokenBalanceOf(address, await erc20TokenFactory.getAddress());
            var balanceBob = await erc20TokenFactory.callERC20TokenBalanceOf(address, await bob.getAddress());
            console.log(balanceFactory);
            console.log(balanceBob);

            expect(balanceFactory + balanceBob).to.be.equal(await erc20Token.totalSupply());
        });

        it("Validate ERC20Token transfer from Alice", async function () {
            const { erc20TokenFactory, owner, alice, bob } = await loadFixture(deployFactory);
            const tx = await erc20TokenFactory.createNewERC20Token('CoiniToken', 'CTK', ethers.parseEther("1542"));
            const response = await tx.wait();
            const address = response.logs[0].address;

            var erc20Token = await ethers.getContractAt('ERC20Token', address);
            await erc20TokenFactory.callERC20TokenMint(address, alice, ethers.parseEther("250"));

            var balanceAlice = await erc20TokenFactory.callERC20TokenBalanceOf(address, alice);

            await erc20Token.connect(alice).transfer(bob, ethers.parseEther("85"));

            var balanceFactory = await erc20TokenFactory.callERC20TokenBalanceOf(address, await erc20TokenFactory.getAddress());
            var balanceAlice = await erc20TokenFactory.callERC20TokenBalanceOf(address, alice);
            var balanceBob = await erc20TokenFactory.callERC20TokenBalanceOf(address, await bob.getAddress());
            console.log(balanceFactory);
            console.log(balanceAlice);
            console.log(balanceBob);

            expect(balanceFactory + balanceAlice + balanceBob).to.be.equal(await erc20Token.totalSupply());
        });

    });
});