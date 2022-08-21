import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import VoucherAbi from '/src/contractsData/Voucher.json'
import VoucherAddress from '/src/contractsData/Voucher-address.json'
import ERC20ContractAbi from '@openzeppelin/contracts/build/contracts/ERC20.json';

import { useWeb3React } from '@web3-react/core';

export const RequestContext = React.createContext();
const [USDC_CONTRACT] = [process.env.USDC_CONTRACT];


export const RequestProvider = ({ children }) => {
  const { library, activate, account, active } = useWeb3React();
  const [contract, setContract] = useState();

  const addVoucher = async (voucher) => {
    let amountWei = ethers.utils.parseEther(voucher.amount);
    const gas = await contract.estimateGas.addVoucher(voucher.id, voucher.hash, voucher.expire_date, {
      value: amountWei._hex
    });
    let tx = await contract.addVoucher(voucher.id, voucher.hash, voucher.expire_date, {
      value: amountWei._hex,
      gasLimit: parseInt(gas * 1.5)
    });

    return tx.wait();

  }
  const approveERC20 = async (contractAddress, amountWei) => {
    const signer = library.getSigner();
    const tokenContract = new ethers.Contract(
      contractAddress,
      ERC20ContractAbi.abi,
      signer
    );

    const gas = await tokenContract.estimateGas.approve(VoucherAddress.address, amountWei);
    return tokenContract.approve(VoucherAddress.address, amountWei, {
      gasLimit: parseInt(gas * 1.2)
    });

  }

  const addTokenVoucher = async (voucher) => {
    let amountWei = ethers.utils.parseUnits(voucher.amount, 6);
    let txApprove = await approveERC20(USDC_CONTRACT, amountWei)
    await txApprove.wait();
    const gas = await contract.estimateGas.addTokenVoucher(voucher.id, voucher.hash, voucher.expire_date, USDC_CONTRACT, amountWei._hex, {
      value: amountWei._hex
    });

    let tx = await contract.addTokenVoucher(voucher.id, voucher.hash, voucher.expire_date, USDC_CONTRACT, amountWei._hex, {
      gasLimit: parseInt(gas * 1.5)
    });
    return tx.wait();

  }

  const claimVoucher = async (id, hash) => {

    const gas = await contract.estimateGas.claim(id, hash);
    let tx = await contract.claim(id, hash, {
      gasLimit: parseInt(gas * 1.5)
    });
    return tx.wait();

  }

  const getWalletVouchers = async () => {

    return await contract.getWalletVouchers();

  }

  const getById = async (id) => {
    return await contract.voucherById(id);
  }

  const removeById = async (id) => {
    const gas = await contract.estimateGas.deleteVoucher(id);

    const tx = await contract.deleteVoucher(id,
      { gasLimit: parseInt(gas) }
    );
    return tx.wait()
  }


  useEffect(() => {
    if (account) {
      const signer = library.getSigner();
      const contract = new ethers.Contract(
        VoucherAddress.address,
        VoucherAbi.abi,
        signer
      );
      setContract(contract);
    }
  }, [account]);
  return (
    <RequestContext.Provider
      value={{ addVoucher, claimVoucher, getWalletVouchers, removeById, getById, contract, addTokenVoucher }}>
      {children}
    </RequestContext.Provider>)

}