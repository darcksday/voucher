Offline Payment Vouchers
==================

Demo: https://voucher-84h8hn.spheron.app/

Pay offline using Polygon Payment Vouchers:
----------

1. Login using your Metamask wallet.
2. Generate payment vouchers (it will lock your funds in the smart contract).
3. Send link or show QR-code to make a payment.

Quick Start (run this project locally)
===========
Step 0: Prerequisites: Make sure you've installed [Node.js] ≥ 12
-------------------------------------

Step 1: Create `.env` on the root dir. && enter  all configs using `env.example`
-------------------------------------

Step 2: Install dependency
-------------------------------------
`yarn install` or `npm install`


Step 3: Deploy contract to Mumbai Testnet
-------------------------------------
`yarn deploy:mumbai` or `npm deploy:mumbai`

Step 4: Run frontend locally
-------------------------------------
`yarn start` or `npm start`

As you can see in `package.json`, this does two things:

1. builds & deploys smart contract to Mumbai TestNet
2. builds & run frontend code on localhost

Go ahead and play with the app and the code. As you make code changes, the app will automatically reload. Every smart contract in Polygon has
its [own associated account]. When you run `deploy:mumbai`, your smart contract gets deployed to the Mumbai Test Network TestNet with a throwaway account.

[Demo]: https://voucher-84h8hn.spheron.app/

[React]: https://reactjs.org/

[Node.js]: https://nodejs.org/en/download/package-manager/

[Metamask Wallet]: https://metamask.io/

[hardhat]: https://hardhat.org/
