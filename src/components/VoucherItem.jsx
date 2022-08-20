import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, generatePath } from 'react-router-dom';
import { useEffect } from 'react';
import { ethers } from 'ethers';
import { formatAmount, dateFormat, isExpired, isEmptyAddress, shortAddress } from '/src/utilits/voucher';
import bn1 from '../assets/bn-1.svg'
import deleteImg from '../assets/delete.png'
import copyImg from '../assets/copy.png'

export const VoucherItem = ({ voucher, index, removeVoucher }) => {
    let url;
  const generateUrl = () => {
    let keys = JSON.parse(localStorage.getItem('app-private-keys'));
    url = window.location.origin + generatePath("/claim/:id/:hash", { id: voucher.id, hash: keys[voucher.id] });
  }
  generateUrl();
  const copyURL = () => {
    navigator.clipboard.writeText(url);
  }


  useEffect(() => {

  }, []);

  return (
    <div className={`one-voucher ${(!isEmptyAddress(voucher.used_by)) ? 'is-used' : ''} ${(isExpired(voucher.expire_date)) ? 'is-expired' : ''}`}>
      <div className="additional-border" />
      <div className="voucher-inner">
        <div className="canvas text-center">
          <QRCodeSVG height={250} width={270} value={url} />
        </div>
        <div className="gift-shadow" />
        <div className="gift-vertical">
          <img src={bn1} alt="" />
        </div>
        <div className="black-bg">
          <img
            onClick={e => removeVoucher(voucher.id)}
            src={deleteImg}
            alt="remove"
            title="remove"
            className="small-button remove-voucher" />

          <h4 className="text-center near-amount">
            <span className={(!isEmptyAddress(voucher.used_by)) ? 'is-used' : ''}>
              {(!isEmptyAddress(voucher.token_contract)) ? `${formatAmount(voucher.amount, 6)} USDC`
                :
                `${formatAmount(voucher.amount, 18)} MATIC`
              }
          </span>
            {(isEmptyAddress(voucher.used_by) && voucher.expire_date) && (

              <small className="used-label">
                <small>Expire
                  {(isExpired(voucher.expire_date)) && (
                    <u className="text-decoration-none">d
                    </u>
                  )}
                  :
                </small>
                {dateFormat(voucher.expire_date)}
              </small>
            )}

            {(!isEmptyAddress(voucher.used_by)) && (
              <small className="used-label">
                <small>Unlocked by: {shortAddress(voucher.used_by)}</small>
              </small>


            )}
            {(parseInt(voucher.paid_amount) != 0) && (

              <small className="used-label">
                <b>Claimed</b>
              </small>
            )}
          </h4>
          <div className="copy" onClick={e => copyURL()}>
            <img src={copyImg} alt="copy" title="copy" />
          </div>
        </div>
      </div>
    </div>

  )


}
