const hre = require("hardhat");
const ERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')
const UNLOCKED_ACCOUNT = '0x818c3e5f0fb69bdf5f49f15fb29b7ac6d3d159d0'


const impersonateAddress = async () => {
  const hre = require('hardhat');
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [UNLOCKED_ACCOUNT],
  });
  return await hre.ethers.getSigner(UNLOCKED_ACCOUNT);
};

found = async () => {
  const contract = await hre.ethers.getContractAt(ERC20.abi, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
  const foundAddress = await impersonateAddress();
  const [deployer, sniper] = await hre.ethers.getSigners()
  const deployerAddress = await deployer.getAddress()
  const amountUsdc = hre.ethers.utils.parseUnits('500', 6)
  const amount = hre.ethers.utils.parseUnits('500', 18)


  await contract.connect(foundAddress).transfer('0x70997970C51812dc3A010C7d01b50e0d17dc79C8', amountUsdc)
  // await deployer.sendTransaction({
  //   to: '0x28faD3430EcA42e3F89eD585eB10ceB9be35f7b9',
  //   value: amount// 1 ether
  // })

  const deployerBalance = await contract.balanceOf(deployerAddress)
  console.log(`USDC amount in deployer: ${deployerBalance / 1e18}\n`)
  //

  return [contract, foundAddress]
}
found().then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
;

