//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./Utils.sol";

contract Voucher is Utils {

  error NotFoundError();

  mapping(address => VouchersStruct[]) public userVouchers;

  struct VouchersStruct {

    string id;
    address owner;
    string hash;
    uint amount;
    address used_by;
    uint paid_amount;
    uint created_date;
    uint expire_date;
    IERC20 token_contract;

  }

  VouchersStruct[] public  allVouchers;

  function addVoucher(string memory _id, string memory _hash, uint _expire_date) external payable {
    require(msg.value > 0, 'You should attach some Deposit');

    (,bool  _isVoucher) = getVoucherIndexById(_id, allVouchers);
    require(!_isVoucher, 'Voucher with this id was added');
    require(!isExpired(_expire_date), 'Wrong expire_date');


    VouchersStruct memory _newVoucher = VouchersStruct(_id, msg.sender, _hash, msg.value, address(0), 0, block.timestamp, _expire_date, IERC20(address(0)) );

    allVouchers.push(_newVoucher);
    userVouchers[msg.sender].push(_newVoucher);

  }


  function addTokenVoucher(string memory _id, string memory _hash, uint _expire_date, IERC20 _token_contract, uint _amount) external payable {
    require(_amount > 0, 'You should attach some Deposit');

    (,bool  _isVoucher) = getVoucherIndexById(_id, allVouchers);
    require(!_isVoucher, 'Voucher with this id was added');
    require(!isExpired(_expire_date), 'Wrong expire_date');

    if (_token_contract.transferFrom(address(msg.sender),address(this), _amount)) {

      VouchersStruct memory _newVoucher = VouchersStruct(_id, msg.sender, _hash, _amount, address(0), 0, block.timestamp, _expire_date, _token_contract);
      allVouchers.push(_newVoucher);
      userVouchers[msg.sender].push(_newVoucher);
    }

  }


  function claim(string memory _id, string memory _hash) external {

    (uint   _voucherInd, bool  _isVoucher) = getVoucherIndexById(_id, allVouchers);
    VouchersStruct storage voucher = allVouchers[_voucherInd];
    string memory _formatedHash = Strings.toHexString(uint(sha256(bytes(_hash))), 32);
    require(_isVoucher && Utils.string_equal(_formatedHash, voucher.hash), 'Hash or Id is not correct!');
    require(voucher.used_by == Utils.NULL_ADDRESS, 'Vacher was used!');
    require(!isExpired(voucher.expire_date), 'Voucher expired');

    if(address(voucher.token_contract)==Utils.NULL_ADDRESS){
      payable(msg.sender).transfer(voucher.amount);

    }else{
      voucher.token_contract.transfer(payable(msg.sender), voucher.amount);
    }
    voucher.used_by = address(msg.sender);
    voucher.paid_amount = voucher.amount;
    updateUserVoucher(voucher);
  }





  function updateUserVoucher(VouchersStruct memory _updateTo) internal {
    (uint   _voucherInd, bool  _isVoucher) = getVoucherIndexById(_updateTo.id, userVouchers[_updateTo.owner]);
    if (_isVoucher) {
      userVouchers[_updateTo.owner][_voucherInd] = _updateTo;
    }
  }


  function getWalletVouchers() public view returns (VouchersStruct[] memory) {


    return userVouchers[msg.sender];


  }


  function deleteVoucher(string memory _id) external {

    (uint   _voucherInd, bool  _isVoucher) = getVoucherIndexById(_id, allVouchers);

    require(_isVoucher, 'Voucher not found');
    require(allVouchers[_voucherInd].owner == msg.sender, 'You are not the owner.');
     VouchersStruct memory _voucher=allVouchers[_voucherInd];
    if (_voucher.used_by == Utils.NULL_ADDRESS && _voucher.paid_amount == 0) {
      if(address(_voucher.token_contract)==Utils.NULL_ADDRESS){
        payable(msg.sender).transfer(allVouchers[_voucherInd].amount);
      }else{
        _voucher.token_contract.transfer(payable(msg.sender), _voucher.amount);
    }
    
    deleteUserVoucher(_id, msg.sender); 
    deleteAllVoucher(_id);
    
    }

  }


  function deleteUserVoucher(string memory _id, address addr) internal returns (bool){
    (uint   _voucherInd, bool  _isVoucher) = getVoucherIndexById(_id, userVouchers[addr]);
    if (_isVoucher) {
      userVouchers[addr][_voucherInd] = userVouchers[addr][userVouchers[addr].length - 1];
      userVouchers[addr].pop();
      return true;
    }
    return false;
  }


  function deleteAllVoucher(string memory _id) internal returns (bool){
    (uint   _voucherInd, bool  _isVoucher) = getVoucherIndexById(_id, allVouchers);
    if (_isVoucher) {
      allVouchers[_voucherInd] = allVouchers[allVouchers.length - 1];
      allVouchers.pop();
      return true;
    }
    return false;
  }

  function getVoucherIndexById(string memory _id, VouchersStruct[] memory _vouchers) internal view returns (uint, bool){
    for (uint _i = 0; _i < _vouchers.length; ++_i) {
      if (Utils.string_equal(allVouchers[_i].id, _id)) {
        return (_i, true);
      }
    }
    return (0, false);
  }

  function voucherById(string memory _id) public view returns (VouchersStruct memory){
    (uint   _voucherInd,) = getVoucherIndexById(_id, allVouchers);

    return allVouchers[_voucherInd];


  }

  function isExpired(uint _date) internal view returns (bool){
    return block.timestamp >= _date;
  }


}



