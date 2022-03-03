import React, {useState, useEffect} from 'react';
import {
  collectIdAndOrPostEachBranch,
} from '../utils/bpagePipelineHelper';

const {MoneyButtonClient} = require('@moneybutton/api-client');
const mbClient = new MoneyButtonClient('ab0a912ef51c1cc9bd6d7d9433fbc3c0'); //store this id in a new money button app after testing is done//oauth identifier
const refreshToken = mbClient.getRefreshToken();
let bsv = require('bsv');
let MoneyButton = require('@moneybutton/react-money-button').default;

//TODO actually make this component polished and usable.
const IndivinstMoneyButton = ({message, baseURL, params}) => {
  //const [id, setId] = useState('');
  //const [userProfile, setUserProfile] = useState('');
  //const [balance, setBalance] = useState(0);
  const [opReturnData, setOpReturnData] = useState('');

  const retrieveMbData = async () => {
    window.location.pathname.includes('oauth-response-web') &&
      mbClient.handleAuthorizationResponse();
    //const {id: userId} = await mbClient.getIdentity();
    //const profile = await mbClient.getUserProfile(userId);
    //const balance = await mbClient.getBalance(userId);
    //setId(userId);
    //setUserProfile(JSON.stringify(profile));
    //setBalance(JSON.stringify(balance));
  };


  useEffect(() => {
    retrieveMbData();
    mbClient.setRefreshToken(refreshToken);

    let opReturnDataAsm = bsv.Script.buildSafeDataOut([
      'reinhardt@moneybutton.com',
      'utf8',
      message,
    ]).toASM();

    setOpReturnData(opReturnDataAsm);
  }, [message]);

  //function onbuttonclick() {
    //collectIdAndOrPostEachBranch(
      //'this was saved from the button on click test',
      //true,
      //baseURL,
      //params,
      //'00dce72a9ec6e9abbd4e69161fe9e74504f5eb91cb4c775b03e05a581d5e6035',
    //);
  //}

  function myOnPaymentCallback(payment) {
    collectIdAndOrPostEachBranch(message, true, baseURL, params, payment.txid);// For some reason this keeps the page constaly on inital load

    //console.log('A payment has occurred!', payment);
  }

            //<button onClick={onbuttonclick}>Button to test</button>
  return (
    <div className="homepage">
      <h2>IndivinstMoneyButton</h2>

      <MoneyButton//TODO: this moneybutton makes the page keep loading
        to={opReturnData} //address of an address when sending a tx back to reinhardt@moneybutton.com
        amount={'0.0000055'} //increase/decrease this depending on the date miners may not accept transactions that are too low.
        currency={'BSV'}
        onPayment={myOnPaymentCallback}
      />
    </div>
  );
};

export default IndivinstMoneyButton;
