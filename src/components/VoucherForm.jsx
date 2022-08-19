import { useContext, useState } from 'react';
import { RequestContext } from '../context/RequestContext';
import { ethers } from 'ethers';


export const VoucherForm = ({ getVouchers }) => {

  const { addVoucher, addTokenVoucher } = useContext(RequestContext);


  const todayDate = () => {
    let today = new Date();
    today.setDate(today.getDate() + 1)
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    return yyyy + '-' + mm + '-' + dd;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    let data = new FormData(event.target);
    let voucher = Object.fromEntries(data.entries());

    if (voucher.amount <= 0) {
      alert("Please specify Deposit");
      return false;
    }

    voucher['id'] = randomStr(12);
    voucher['hash'] = randomStr(64);
    let storage = JSON.parse(localStorage.getItem('app-private-keys'));
    storage[voucher['id']] = voucher['hash'];
    localStorage.setItem('app-private-keys', JSON.stringify(storage));


    if (voucher.expire_date) {
      voucher['expire_date'] = Date.parse(voucher.expire_date) / 1000;
    }
    voucher.hash = ethers.utils.sha256(ethers.utils.toUtf8Bytes(voucher.hash));
    try {
      if (voucher.type === 'matic') {
        await addVoucher(voucher);
      } else {
        await addTokenVoucher(voucher);
      }

    } catch (e) {
      alert("Something went wrong!");
      throw e //re-throw
    } finally {
      getVouchers();

    }


  }


  const randomStr = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  let voucherType = 'static';
  const voucherTypeOptions = [
    { value: 'matic', text: 'MATIC' },
    { value: 'usdc', text: 'USDC' },
  ];
  return (
    <div className="one-voucher add-voucher-form">
      <form onSubmit={(e) => handleSubmit(e)} className="row">
        <div className="offset-1 col-10">
          <div className="additional-border" />
          <h4 className="text-center text-uppercase mb-3">
            Create Voucher
          </h4>
          <div className="row mb-2">
            <div className="col-5 text-right">
              <label className="form-check-label text-right pt-1">Payment Type<sup>*</sup></label>
            </div>
            <div className="col-6">
              <select name="type" className="custom-select">
                {
                  voucherTypeOptions.map((item, index) =>
                    (<option key={index} value={item.value}> {item.text} </option>))
                }
              </select>
            < /div>
          </div>
          <div className="row mb-2">
            <div className="col-5 text-right">
              <label className="form-check-label pt-2">
                {voucherType === 'static' ? "Expire Date" : "Full unlock Date"}<sup>*</sup>
              </label>
            </div>
            <div className="col-6">
              <input name="expire_date" className="form-control" type="date" min={todayDate()} placeholder="Expire Date" />
            </div>
          </div>
          <div className="row">
            <div className="col-5 text-right">
              <label className="form-check-label pt-2">Amount<sup>*</sup></label>
            </div>
            <div className="col-6">
              <div className="input-group">
                <input name="amount" className="form-control" type="number" required min="0.1" max="1000" step="0.1" />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="submit">CREATE</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>

  )


}
