const path=require("path");
const fs=require("fs");

const solc=require("solc");

const lotterypath=path.resolve(__dirname,"Contracts","Lottery.sol");
const source=fs.readFileSync(lotterypath,'utf8');

const input = {
    language: 'Solidity',
    sources: {
      'Lottery.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

module.exports=JSON.parse(solc.compile(JSON.stringify(input))).contracts['Lottery.sol'].Lottery;
