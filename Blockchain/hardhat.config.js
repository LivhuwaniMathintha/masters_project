// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition"); // Add this line

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28", // Or whatever version your contract uses
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // You can adjust this value, 200 is a common default
      },
      viaIR: true, // Keep this, it's good for optimization
      debug: {
        // Change 'strip' to 'default' or remove this 'debug' block entirely
        // for local development to ensure revert strings are present.
        revertStrings: "default" // <--- CHANGE THIS LINE
      }
    },
  },
  // You might have other Hardhat configurations here
  networks: {
    hardhat: {
      // You can configure your local Hardhat network here if needed
      // mining: {
      //   auto: false
      // }
    },
    localhost: {
      url: "http://127.0.0.1:8545", // Default Hardhat node URL
    }
  },
  etherscan: {
    // ...
  },
};