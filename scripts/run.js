const main = async () => {

    const [owner, superCoder] = await hre.ethers.getSigners();
    const domainContractFactory = await hre.ethers.getContractFactory('Domains');
    const domainContract = await domainContractFactory.deploy("af");
    await domainContract.deployed();

    console.log("Contract deployed to : ", domainContract.address);
    console.log("Contract deployed by : ", owner.address);

    let txn = await domainContract.register("s", {value : hre.ethers.utils.parseEther('1234')});
    await txn.wait();

    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract Balance : ", hre.ethers.utils.formatEther(balance));

    try{
        txn = await domainContract.connect(superCoder).withdraw();
        await txn.wait();    
    }catch(error){
        console.log("Could not rob the balance!");
    }

    let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    console.log("Balance of the owner before withdrawal : ", hre.ethers.utils.formatEther(ownerBalance));

    txn = await domainContract.connect(owner).withdraw();
    await txn.wait();

    ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    let contractBalance = await hre.ethers.provider.getBalance(domainContract.address);

    console.log("Balance of the owner after withdrawal : ", hre.ethers.utils.formatEther(ownerBalance));
    console.log("Balance of the contract after the withdrawal : ", hre.ethers.utils.formatEther(contractBalance));

};

const runMain = async () => {
    try{
        await main();
        process.exit(0);
    }catch(error){
        console.log(error);
        process.exit(1);
    }
};

runMain();