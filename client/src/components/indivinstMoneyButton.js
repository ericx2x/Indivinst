import React, {useState, useEffect} from 'react';
import {collectIdAndOrPostEachBranch} from '../utils/bpagePipelineHelper';

let bsv = require('bsv');
let MoneyButton = require('@moneybutton/react-money-button').default;

//TODO actually make this component polished and usable.
const IndivinstMoneyButton = ({message, baseURL, params}) => {
  //const [id, setId] = useState('');
  //const [userProfile, setUserProfile] = useState('');
  //const [balance, setBalance] = useState(0);
  const [opReturnData, setOpReturnData] = useState('');


  useEffect(() => {
    let opReturnDataAsm = bsv.Script.buildSafeDataOut([
      'reinhardt@moneybutton.com',
      'utf8',
      message,
    ]).toASM();

    setOpReturnData(opReturnDataAsm);
  }, [message]);

  function onbuttonclick() {
    collectIdAndOrPostEachBranch(
      message,
      true,
      baseURL,
      params,
      '00dce72a9ec6e9abbd4e69161fe9e74504f5eb91cb4c775b03e05a581d5e6035', //just a random tx id for testing
    );
  }

  function myOnPaymentCallback(payment) {
    collectIdAndOrPostEachBranch(message, true, baseURL, params, payment.txid); // For some reason this keeps the page constaly on inital load

    //console.log('A payment has occurred!', payment);
  }
  const getDustLimit = x => {
    const s = 0.0000000000001; // s = serialized size of transaction output //No clue what this number means.. time to lookup serialized on google.

    const d = 300; //dustlimitfactor, percent value between 300 and 0, default: 300//So just keep it 300?

    const r = 250; //dustrelayfee, default: default-minrelaytxfee, 250 as of v1.0.8

    const m = 148; //148, minimum bytes of spendable input

    console.log('dustLimit', (d * ((r * (s + m)) / 1000)) / 100);

    return (d * ((r * (s + m)) / 1000)) / 100;

    //Note that the division by 100 as the dustlimitfactor specifies a percentage value.
    //
    //A satoshi is this number apparently when represented as a decimal to a bitcoin
    //0.00000001
  };
  //getDustLimit();

  return (
    <div className="homepage">
      {/*<h2>IndivinstMoneyButton</h2>*/}

      <button onClick={onbuttonclick}>Button to test</button>
      <MoneyButton //TODO: this moneybutton makes the page keep loading
        to={opReturnData} //address of an address when sending a tx back to reinhardt@moneybutton.com
        amount={'0.00000135'} //increase/decrease this depending on the date miners may not accept transactions that are too low.
        currency={'BSV'}
        onPayment={myOnPaymentCallback}
      />
    </div>
  );
};

export default IndivinstMoneyButton;
