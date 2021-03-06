import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import dotenv from 'dotenv';

dotenv.config()
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const defaults = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
        url:process.env.STAGING_ALCHEMY_KEY,
        accounts: [process.env.PRIVATE_KEY],
    },
  },
};

export default defaults;