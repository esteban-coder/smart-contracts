var { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
var { expect } = require("chai");
var { ethers } = require("hardhat");

// npx hardhat test test/testERC721TokenFactory.js 

describe("Testing Factory ERC721Token", function () {
    async function deployFactory() {
        const [owner, alice] = await ethers.getSigners();
        const erc721TokenFactory = await ethers.deployContract("ERC721TokenFactory");
        return { erc721TokenFactory: erc721TokenFactory, owner, alice };
    }

    describe("ERC721Token Operations", function () {
        it("Create ERC721Token", async function () {
            const { erc721TokenFactory} = await loadFixture(deployFactory);
            var tx = await erc721TokenFactory.createNewERC721Token('CoiniNFT', 'COI', "exampleOfBaseURI");
            var count = await erc721TokenFactory.erc721TokenCount();
            var index = Number(count) - 1;

            await expect(tx).to.emit(erc721TokenFactory, "NewERC721Token").withArgs(await erc721TokenFactory.erc721TokenArray(index), index);
        });

        it("Validate ERC721Token address", async function () {
            const { erc721TokenFactory} = await loadFixture(deployFactory);
            await erc721TokenFactory.createNewERC721Token('CoiniToken', 'CTK', "exampleOfBaseURI");
            var count = await erc721TokenFactory.erc721TokenCount();
            var index = Number(count) - 1;
            var erc721Contract = await ethers.getContractAt('ERC721Token', await erc721TokenFactory.erc721TokenArray(index));

            expect(await erc721Contract.getAddress()).to.be.equal(await erc721TokenFactory.erc721TokenArray(index));
        });

        it("Validate NFT Minting", async function () {
            const { erc721TokenFactory, alice} = await loadFixture(deployFactory);
            await erc721TokenFactory.createNewERC721Token('CoiniToken', 'CTK', "exampleOfBaseURI");
            var count = await erc721TokenFactory.erc721TokenCount();
            var index = Number(count) - 1;
            var nftTx = await erc721TokenFactory.callSafeMint(await erc721TokenFactory.erc721TokenArray(index), alice.address, 0, "Example");

            expect(nftTx).to.emit(erc721TokenFactory, "NewNftMinted").withArgs(await erc721TokenFactory.erc721TokenArray(index), alice.address, 0, "Example");
        });

        it("Validate OwnerOf", async function () {
            const { erc721TokenFactory, alice} = await loadFixture(deployFactory);
            await erc721TokenFactory.createNewERC721Token('CoiniToken', 'CTK', "exampleOfBaseURI");
            var count = await erc721TokenFactory.erc721TokenCount();
            var index = Number(count) - 1;

            await erc721TokenFactory.callSafeMint(await erc721TokenFactory.erc721TokenArray(index), alice.address, 0, "Example");

            expect(await erc721TokenFactory.callOwnerOf(await erc721TokenFactory.erc721TokenArray(index), 0)).to.be.equal(alice.address);
        });

        it("Validate Safe Transfer", async function () {
            const { erc721TokenFactory, owner, alice} = await loadFixture(deployFactory);
            await erc721TokenFactory.createNewERC721Token('CoiniToken', 'CTK', "exampleOfBaseURI");
            var count = await erc721TokenFactory.erc721TokenCount();
            var index = Number(count) - 1;

            await erc721TokenFactory.callSafeMint(await erc721TokenFactory.erc721TokenArray(index), owner.address, 0, "Example");
            await erc721TokenFactory.callSafeTransfer(await erc721TokenFactory.erc721TokenArray(index), owner.address, alice.address, 0);

            expect(await erc721TokenFactory.callOwnerOf(await erc721TokenFactory.erc721TokenArray(index), 0)).to.be.equal(alice.address);
        });

        it("Validate Burning", async function () {
            const { erc721TokenFactory, owner, alice} = await loadFixture(deployFactory);
            await erc721TokenFactory.createNewERC721Token('CoiniToken', 'CTK', "exampleOfBaseURI");
            var count = await erc721TokenFactory.erc721TokenCount();
            var index = Number(count) - 1;
            await erc721TokenFactory.callSafeMint(await erc721TokenFactory.erc721TokenArray(index), alice.address, 0, "Example");
            await erc721TokenFactory.callBurn(await erc721TokenFactory.erc721TokenArray(index), alice.address, 0);

            var nft = await ethers.getContractAt('ERC721', await erc721TokenFactory.erc721TokenArray(index));
            
            expect(await nft.balanceOf(alice.address)).to.be.equal(0);
        });
    });
});