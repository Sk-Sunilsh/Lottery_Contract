const hdtruf=require("@truffle/hdwallet-provider");
const {Web3}=require("web3");

const provider=new hdtruf("mnemanic key","infura_sepolia_link");

const {abi,evm}=require("./compile");

const web3=new Web3(provider);

const deploy=async()=>{
const accounts=await web3.eth.getAccounts();
console.log("Attemptiong to deploy from account",accounts[0]);

const result=await new web3.eth.Contract(abi)
.deploy({data:evm.bytecode.object})
.send({from:accounts[0],gas:"1000000"});

//console.log(JSON.stringify(abi));
console.log("Succesfull");
console.log("Contract Deployed to",result.options.address);
provider.engine.stop();
};
deploy();