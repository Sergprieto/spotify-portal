import hre from "hardhat"

const main = async () => {
  const WaveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await WaveContractFactory.deploy({value: hre.ethers.utils.parseEther("0.1")});
  await waveContract.deployed();
  console.log("Contract address is:", waveContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log("Contract Balance:", hre.ethers.utils.formatEther(contractBalance));

  let waveTxn = await waveContract.wave("this is message #1");
  await waveTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log("Contract Balance:", hre.ethers.utils.formatEther(contractBalance));

}

main() 
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });