import React, {useState, useEffect} from 'react';
import {collectIdAndOrPostEachBranch} from '../utils/bpagePipelineHelper';

const {MoneyButtonClient} = require('@moneybutton/api-client');
var config = require('../config/configFront.json');
const moneyButtonKey =
  typeof window !== 'undefined' && !window.location.href.includes('localhost')
    ? config.moneybuttonProductionWallet
    : config.moneybuttonLocalhostWallet;
const mbClient = new MoneyButtonClient(moneyButtonKey);
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
    const {id: userId} = await mbClient.getIdentity();
    const profile = await mbClient.getUserProfile(userId);
    const balance = await mbClient.getBalance(userId);
    console.log('id', userId);
    console.log('profile', profile);
    console.log('balance', balance);
    //setId(userId);
    //setUserProfile(JSON.stringify(profile));
    //setBalance(JSON.stringify(balance));
  };

  useEffect(async () => {
    console.log('ixd');
    const {id: userId} = await mbClient.getIdentity();
    const profile = await mbClient.getUserProfile(userId);
    const balance = await mbClient.getBalance(userId);
    console.log('id', userId);
    console.log('profile', profile);
    console.log('balance', balance);
    retrieveMbData();
    mbClient.setRefreshToken(refreshToken);

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
      '00dce72a9ec6e9abbd4e69161fe9e74504f5eb91cb4c775b03e05a581d5e6035',//just a random tx id for testing
    );
  }

  function myOnPaymentCallback(payment) {
    collectIdAndOrPostEachBranch(message, true, baseURL, params, payment.txid); // For some reason this keeps the page constaly on inital load

    //console.log('A payment has occurred!', payment);
  }

  return (
    <div className="homepage">
      {/*<h2>IndivinstMoneyButton</h2>*/}

      <button onClick={onbuttonclick}>Button to test</button>
      <MoneyButton //TODO: this moneybutton makes the page keep loading
        to={opReturnData} //address of an address when sending a tx back to reinhardt@moneybutton.com
        amount={'0.0000035'} //increase/decrease this depending on the date miners may not accept transactions that are too low.
        currency={'BSV'}
        onPayment={myOnPaymentCallback}
      />
    </div>
  );
};

export default IndivinstMoneyButton;
