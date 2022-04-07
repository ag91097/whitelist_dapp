require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.API_KEY_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
// 0x4e8d2CCcA690850b0c310Cd0AeF2f54ea13c8906
// 0xD3919f1bAA6adFF38F1986303c08e4b91d9EDd21
