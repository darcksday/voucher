import { useContext, useState, useEffect, useRef } from 'react'
import { VoucherItem } from '../components/VoucherItem';
import { VoucherForm } from '../components/VoucherForm';
import { RequestContext } from '../context/RequestContext';
import printImg from '../assets/print.svg'
import loader from '../assets/loader.gif'


export const Vouchers = () => {
  const { getWalletVouchers, removeById } = useContext(RequestContext);

  const [isReady, setIsReady] = useState(false);
  const [vouchers, setVouchers] = useState([]);


  // Remove payment voucher
  const removeVoucher = async (id) => {
    if (confirm("Please confirm voucher removing.")) {
      try {
        await removeById(id);

      } catch (e) {
        alert("Something went wrong!");
        throw e //re-throw
      } finally {
        getVouchers();
        console.log('delete' + id)
      }
    }
  }


  // Check voucher is valid
  const isValidVoucher = (id) => {
    let keys = JSON.parse(localStorage.getItem('app-private-keys'));
    return keys[id] !== undefined;
  }

  const print = () => {
    window.print()
  }

  const getVouchers = () => {
    getWalletVouchers().then((result) => {
      let filtered;
      filtered = [];
      result.forEach(v => {
        if (isValidVoucher(v.id)) {

          filtered.push(v);
        }
      });
      setVouchers(filtered);
      setIsReady(true);
    });


  }

  useEffect(() => {
    if (!localStorage.getItem('app-private-keys')) {
      localStorage.setItem('app-private-keys', JSON.stringify({}));
    }
    getVouchers();

  }, [])


  return (
    <main>
      <div className="container-lg position-relative">
        <button className="position-absolute rounded-circle border border-secondary print-btn" onClick={e => print()}>
          <img src={printImg} width="18" alt="" />
        </button>
        <h2 className="text-center mb-5 page-title">My Payment Vouchers</h2>
        {(isReady) && (
          <div> {(vouchers.length == 0) && (
            <p className="text-center">
              <b>You don't have vouchers, please create new one:</b>
            </p>)}
            <div className={(vouchers.length) ? 'vouchers' : 'no-vouchers'}>
              {vouchers.map((voucher, index) => (
                <VoucherItem key={index} voucher={voucher} removeVoucher={removeVoucher} />))
              }


              <VoucherForm getVouchers={getVouchers} />

            </div>
          </div>

        )}
        {(!isReady) && (
          <div className="text-center">
            <img src={loader} alt="" width="70" />
          </div>)}


      </div>
    </main>
  )
}



