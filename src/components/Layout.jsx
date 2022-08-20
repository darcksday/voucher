import { useContext, useState, useEffect, useRef } from 'react'
import { Outlet, Link } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import { shortAddress } from '/src/utilits/voucher';
import { useNavigate, useLocation } from 'react-router-dom';

export const Layout = () => {
  const { active, account, activate, deactivate, chainId } = useWeb3React();
  const navigate = useNavigate();

  const logout = (e) => {
    e.preventDefault();
    deactivate();
    navigate('/');
  }


  return (
    <>
      <header className="pt-3 mb-4">

        <div className="container-lg d-flex justify-content-between">
          <Link to={'/'}>
            <img src="/src/assets/logo.png" width="150" alt="logos" />
          </Link>
          <div>
            <span className="username fw-bold text-black-50 pt-1">{shortAddress(account)}</span>
            <button className="btn btn-primary" onClick={(e) => logout(e)}>Sign out</button>
          </div>
        </div>
      </header>

      <Outlet />
      <br />
      <footer>
        Voucher &copy; 2022
      </footer>
    </>


  )


}
