require('dotenv').config({ path: __dirname + '/.env' });
require("@nomicfoundation/hardhat-toolbox");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");
require("./tasks/hyperlane");

let accounts = { mnemonic: "rare trip luxury giant accident nurse winner grid fruit bright recipe alone", }

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      },
      {
        version: "0.8.13",
        settings: {},
      },
      {
        version: "0.8.17",
        settings: {},
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337 // We set 1337 to make interacting with MetaMask simpler
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: accounts,
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      gasPrice: 1000000000,
      accounts: accounts,
    },
    scrollAlpha: {
      url: "https://alpha-rpc.scroll.io/l2" || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    zkEVM: {
      url: `https://rpc.public.zkevm-test.net`,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
      chainId: 44787
    },
    celo: {
      url: "https://forno.celo.org",
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
      chainId: 42220
    },
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY]
    },
    linea: {
      url: "https://rpc.goerli.linea.build",
      chainId: 59140,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    customChains: [
      {
        network: "chiado",
        chainId: 10200,
        urls: {
          //Blockscout
          apiURL: "https://blockscout.com/gnosis/chiado/api",
          browserURL: "https://blockscout.com/gnosis/chiado",
        },
      },
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          // 3) Select to what explorer verify the contracts
          // Gnosisscan
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/",
          // Blockscout
          //apiURL: "https://blockscout.com/xdai/mainnet/api",
          //browserURL: "https://blockscout.com/xdai/mainnet",
        },
      },
    ],
    apiKey: {
      //4) Insert your Gnosisscan API key
      //blockscout explorer verification does not require keys
      chiado: "your key",
      gnosis: "your key",
    },
  }
};

