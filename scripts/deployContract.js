const { task } = require("hardhat/config");
const { toBigInt } = require("ethers");

async function deploy(contractName, constructorArgs, contractPath, hre) {
    constructorArgs = constructorArgs.replace(/'/g, '"')
    var constructorArgs = JSON.parse(constructorArgs);

    console.log("contractName: ", contractName);
    console.log("constructorArgs: ", constructorArgs);

    const contract = await hre.ethers.deployContract(contractName, constructorArgs);

    console.log(`${contractName} is deployed on network ${hre.network.name}, at address: ${await contract.getAddress()}`);

    if (!!hre.network.name && hre.network.name != "localhost") {
        var res = await contract.waitForDeployment();
        await res.deploymentTransaction().wait(10);

        if (contractPath != '') {
            console.log('verify with contract parameter');

            await hre.run("verify:verify", {
                address: await contract.getAddress(),
                constructorArguments: constructorArgs,
                contract: contractPath
            });
        }
        else {
            console.log('verify without contract parameter');

            await hre.run("verify:verify", {
                address: await contract.getAddress(),
                constructorArguments: constructorArgs,
            });
        }
    }

}

// Uso del script:

// deployar contrato sin parametros:
// npx hardhat --network mumbai deployContract CoiniToken

// deployar contrato con n parametros:
// npx hardhat --network mumbai deployContract CoiniToken "['0x305D0660aAf097826177D0A38241fa162F6eC9e7','0xC840F562D9F69b46b4227003E01525CB99344B72']"

task("deployContract", "Deploys a specified smart contract")
    //.addParam("contractName", "The smart contract name")
    .addPositionalParam("contractName", "The smart contract name")
    .addPositionalParam("constructorArgs", "An array of the smart contract arguments", "[]")
    .addPositionalParam("contractPath", "Contract path", "")
    .setAction(async (taskArgs, hre) => {
        //console.log(`${process.env.HARDHAT_NETWORK}`);
        //console.log(`${hre.network.name}`);
        //console.log("taskArgs", taskArgs);

        await hre.run("compile");
        await deploy(taskArgs.contractName, taskArgs.constructorArgs, taskArgs.contractPath, hre).catch(async (error) => {
            console.error(error);
            process.exitCode = 1;
        });
    });