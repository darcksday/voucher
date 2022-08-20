import { useContext, useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Web3Context } from '../context/Web3Context';
import logo from '../assets/logo.png'
import sampleImg from '../assets/sample.png'
import unlock1 from '../assets/unlock1.png'
import unlock2 from '../assets/unlock2.png'


export const Home = () => {
  const { activate, account } = useWeb3React();
  const navigate = useNavigate();
  const { connectWeb3Wallets } = useContext(Web3Context);
  useEffect(() => {
    if (account) {
      navigate('/vouchers')
    }
  }, [account]);


  return (
    <main className="container">
      <div className="text-center mt-lg-5 mb-lg-2 mt-2">
        <img src={logo} alt="logo" width="200" />
      </div>
      <h2 className="mb-lg-5 mb-3 text-center">
        Polygon Payment Vouchers
      </h2>
      <div className="landing-top">
        <img src={sampleImg} alt="sample" className="sample-image" />
        <div>
          <p className="mt-2 pt-3">
            <b>Extend the finance management with POLYGON Payment Vouchers!</b>
          </p>
          <p>Lock your MATIC or USDC tokens using our smart contract and receive unique voucher that can be used by scan QR-code or follow URL to get locked
            tokens.</p>
          <p className="pt-2 text-md-start text-center">
            <button className="btn btn-primary" onClick={() => {
              connectWeb3Wallets(activate);
            }}>Sign In &raquo;</button>
          </p>
        </div>
      </div>

      <div className="row text-center mt-5">
        <div className="col-10 offset-1 mt-2">
          <div className="row">
            <div className="col-4">
              <div className="counter">1</div>
              <p className="fw-bolder mb-1">Login using your <a href="https://metamask.io/" className="text-black" target="_blank">Metamask Wallet</a>.</p>
              <div>Polygon Blockchain - scalable and fast solution with low transaction fees without ever sacrificing on security.</div>
            </div>
            <div className="col-4">
              <div className="counter">2</div>
              <p className="fw-bolder mb-1">Generate payment vouchers.</p>
              <div>You can create one or multiple Vouchers in few seconds!</div>
            </div>
            <div className="col-4">
              <div className="counter">3</div>
              <p className="fw-bolder mb-1">Send secret URL or scan QR-code.</p>
              <div>Mobile-friendly solution allow to use Payment Vouchers on any device.</div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-center mt-5 mb-4">Payment Options</h3>
      <div className="row">
        <div className="col-6 text-right">
          <img src={unlock1} alt="" className="sample-image" width="60%" />
        </div>
        <div className="col-6">
          <h5 className="mt-2">MATIC</h5>
          <p className="mb-1">Useful for:</p>
          <ul>
            <li>Send direct payments.</li>
            <li>Reward for event participants.</li>
            <li>Gift-cards for anyone.</li>
          </ul>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-6 text-right">
          <img src={unlock2} alt="" className="sample-image" width="60%" />
        </div>
        <div className="col-6">
          <h5 className="pt-4">USDC</h5>
          <p className="mb-1">Useful for:</p>
          <ul>
            <li>Send direct payments.</li>
            <li>Reward for event participants.</li>
            <li>Gift-cards for anyone.</li>
          </ul>
        </div>
      </div>

    </main>
  )

}
