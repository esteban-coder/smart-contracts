//require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {

    //var [admin] = await ethers.getSigners();

    //var contract = await ethers.deployContract("CoiniToken");
    var contract = await ethers.deployContract("CoiniToken", ['0x305D0660aAf097826177D0A38241fa162F6eC9e7','0xC840F562D9F69b46b4227003E01525CB99344B72']);

    console.log(`CoiniToken is deployed on network ${process.env.HARDHAT_NETWORK}, at address: ${await contract.getAddress()}`);
    //console.log(`Address del contrato ${await contract.getAddress()}`);

    if (!!process.env.HARDHAT_NETWORK && process.env.HARDHAT_NETWORK != "localhost") {
        // HARDHAT_NETWORK: mumbai
        // HARDHAT_NETWORK: $ npx hardhat --network [HARDHAT_NETWORK] run scripts/deploy.js
        var res = await contract.waitForDeployment();
        await res.deploymentTransaction().wait(10);

        await hre.run("verify:verify", {
            address: await contract.getAddress(),
            //constructorArguments: [],
            constructorArguments: ['0x305D0660aAf097826177D0A38241fa162F6eC9e7','0xC840F562D9F69b46b4227003E01525CB99344B72'],
        });
    }

}

main();

// Uso del script:

// deployar contrato con/sin parametros:
// npx hardhat --network mumbai run scripts/deploy_demo.js
