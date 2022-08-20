import { useContext, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { RequestContext } from '../context/RequestContext';
import { formatAmount, dateFormat, isExpired, isEmptyAddress } from '/src/utilits/voucher';

export const Claim = () => {

  const { getById, claimVoucher } = useContext(RequestContext);

  const [voucher, setVoucher] = useState(null);
  const [isPaymentLoader, setIsPaymentLoader] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);


  let { id, hash } = useParams();

  const claim = async (e) => {
    e.preventDefault();

    if (id && hash) {
      try {
        setIsPaymentLoader(true)
        await claimVoucher(id, hash)


      } catch (e) {
        alert("Something went wrong!");
        throw e //re-throw
      } finally {
        setPaymentSuccess(true)
        setIsPaymentLoader(false)
      }

    }

  }

  useEffect(() => {
    if (id) {
      getById(id).then((result) => {
        setVoucher(result);

      })
    }
  }, []);

  return voucher && (
    <main>
      <div className="container">
        <h1 className="text-center">Payment</h1>
        {(!isPaymentLoader && !paymentSuccess) && (

          <div className="text-center mt-3 row">
            <div className="m-auto col col-lg-6">
              <p><b>Take payment from Voucher</b></p>
              <div className="one-voucher pay-voucher">
                <form onSubmit={(e) => claim(e)} className="row">
                  <div className="offset-1 col-10">
                    <div className="additional-border">

                    </div>
                    <div style={{ fontSize: '20px' }}>
                      Balance: <b>
                      {(!isEmptyAddress(voucher.token_contract)) ? `${formatAmount(voucher.amount, 6)} USDC`
                        :
                        `${formatAmount(voucher.amount, 18)} MATIC`
                      }
                    </b>
                    </div>

                    <div>
                      {(parseInt(voucher.paid_amount) != 0) && (
                        <div>
                          <b className="text-danger">Voucher already claimed.</b>
                        </div>
                      )}


                      {(isEmptyAddress(voucher.used_by) && voucher.expire_date) && (
                        <span>Expire Date: {dateFormat(voucher.expire_date)}</span>

                      )}
                      <div className="mt-3">
                        <button type="submit" className="fw-bold text-uppercase btn btn-primary"
                                disabled={isExpired(voucher.expire_date) || parseInt(voucher.paid_amount) != 0}>Claim
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>


        )}
        {(!isPaymentLoader && paymentSuccess) && (
          <div className="row text-center mt-3 success-payment">
            <div className="col" />
            <div className="col col-lg-5 col-md-6">
              <img src="/src/assets/success.png" alt="success" width="60" />
              <p className="mt-3">
                <b>You received
                  {(!isEmptyAddress(voucher.token_contract)) ? ` ${formatAmount(voucher.amount, 6)} USDC`
                    :
                    ` ${formatAmount(voucher.amount, 18)} MATIC`
                  }

                </b>
              </p>
              <div className="mt-2">
                <Link className="btn btn-outline-secondary" to={'/'}>Open my Payment Vouchers</Link>

              </div>
            </div>
            <div className="col" />
          </div>
        )}

        {(isPaymentLoader) && (<div className="text-center">
          <p>Processing payment...</p>
          <img src="/src/assets/loader.gif" alt="" width="70" />
        </div>)}

      </div>
    </main>
  )
}
