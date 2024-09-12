const assert=require("assert");
const ganache=require("ganache");
const {Web3}=require("web3");

const web3=new Web3(ganache.provider());

let lottery;
let accounts;


const{abi,evm}=require("../compile");
beforeEach(async()=>{
accounts=await web3.eth.getAccounts();

lottery=await new web3.eth.Contract(abi)
.deploy({data:evm.bytecode.object})
.send({from:accounts[0],gas:"1000000"});

});


describe("Lottery contract",()=>{
    it("deploys a contract",()=>{
        assert.ok(lottery.options.address);
    });

    it("allows one account to enter",async()=>{
        await lottery.methods.enter().send({from:accounts[0],value:web3.utils.toWei('0.02',"ether"),

        });

        const players=await lottery.methods.getplayers().call({from:accounts[0],});
        assert.equal(accounts[0],players[0]);
        assert.equal(1,players.length);
    });

    it("allows multiple accounts to enter",async()=>{
        await lottery.methods.enter().send({from:accounts[0],value:web3.utils.toWei('0.02',"ether"),});
        await lottery.methods.enter().send({from:accounts[1],value:web3.utils.toWei('0.02',"ether"),});
        await lottery.methods.enter().send({from:accounts[2],value:web3.utils.toWei('0.02',"ether"),});

        const players=await lottery.methods.getplayers().call({from:accounts[0],});
        assert.equal(accounts[0],players[0]);
        assert.equal(accounts[1],players[1]);
        assert.equal(accounts[2],players[2]);
        assert.equal(3,players.length);
    });

    it("required minimum amount of ether to enter",async()=>{
        try{
        await lottery.methods.enter().send({from:accounts[0],value:web3.utils.toWei('0.01',"ether")});
        assert(false);
        }
        catch(err){
            assert(err);
        }
    });

    it("only manager to pick winner",async()=>{
        try{
        await lottery.ethods.winner().send({from:accounts[0]});
        assert(false);
        }
        catch(err){
            assert(err);
        }

    });

    it("money send to the winner",async()=>{
        await lottery.methods.enter().send({from:accounts[0],value:web3.utils.toWei("0.2","ether")});

        const initalbal=await web3.eth.getBalance(accounts[0]);

        await lottery.methods.winner().send({from:accounts[0]});

        const finalbal=await web3.eth.getBalance(accounts[0]);
const diff=finalbal-initalbal;
        assert(diff>web3.utils.toWei("0.1","ether"));

    });

    it("if the players array reset to 0",async()=>{
        await lottery.methods.enter().send({from:accounts[0],value:web3.utils.toWei("0.2","ether")});
        await lottery.methods.enter().send({from:accounts[1],value:web3.utils.toWei("0.2","ether")});
        await lottery.methods.winner().send({from:accounts[0]},);
        const players=await lottery.methods.getplayers().call({from:accounts[0]});
        assert.equal(0,players.length);
    });
    it("after each round contract has balance 0",async()=>{
        await lottery.methods.enter().send({from:accounts[0],value:web3.utils.toWei("0.2","ether")});

await lottery.methods.winner().send({from:accounts[0]},);
const bal=await web3.eth.getBalance(lottery.options.address);
assert.equal(bal,web3.utils.toWei("0","ether"));
    });

});