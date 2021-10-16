import hre from "hardhat"

const main = async () => {

  const WaveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await WaveContractFactory.deploy({value: hre.ethers.utils.parseEther("0.0001")});
  await waveContract.deployed();
  console.log("Deploying contracts with the account:", waveContract.address);
}

main() 
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
