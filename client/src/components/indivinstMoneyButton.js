import React, {useState, useEffect} from 'react';
import {
  collectIdAndOrPostEachBranch,
  getBpageData,
} from '../utils/bpagePipelineHelper';

const {MoneyButtonClient} = require('@moneybutton/api-client');
const mbClient = new MoneyButtonClient('ab0a912ef51c1cc9bd6d7d9433fbc3c0'); //store this id in a new money button app after testing is done//oauth identifier
const refreshToken = mbClient.getRefreshToken();
//var Centrifuge = require('centrifuge');
let bsv = require('bsv');
let MoneyButton = require('@moneybutton/react-money-button').default;

//TODO actually make this component polished and usable.
const IndivinstMoneyButton = ({message, baseURL, params, txid}) => {
  const [id, setId] = useState('');
  const [userProfile, setUserProfile] = useState('');
  const [balance, setBalance] = useState(0);
  const [opReturnData, setOpReturnData] = useState('');

  //console.log('Thetxid', txid);

  const handleMBRequestAuthorization = () => {
    mbClient.requestAuthorization(
      'auth.user_identity:read users.profiles:read users.balance:read',
      'http://localhost:9008/oauth-response-web',
    );
  };


  const retrieveMbData = async () => {
    window.location.pathname.includes('oauth-response-web') &&
      mbClient.handleAuthorizationResponse();
    const {id: userId} = await mbClient.getIdentity();
    const profile = await mbClient.getUserProfile(userId);
    const balance = await mbClient.getBalance(userId);
    setId(userId);
    setUserProfile(JSON.stringify(profile));
    setBalance(JSON.stringify(balance));
  };

  const hextoascii = str1 => {
    var hex = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  };

  useEffect(async () => {
    const response = await getBpageData(baseURL, params);
    //retrieveTxIdData(response.data[0].transaction_id);
  }, []);

  //const retrieveTxIdData = async txid => {
  //try {
  //const apiData = await fetch(
  //`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txid}`,
  //);
  //const actualData = await apiData.json();
  //return actualData;
  //} catch (e) {
  //console.error(e);
  //return console.error(e);
  //}
  //};

  useEffect(() => {
    retrieveMbData();
    mbClient.setRefreshToken(refreshToken);

    //console.log('M', Buffer.from('moneybutton.com').toString('hex'));

    //console.log('X', hexToAscii('57726974696e6731').toString());

    //console.log('Z', Buffer.from('57726974696e6731', 'hex').toString());

    let opReturnDataAsm = bsv.Script.buildSafeDataOut([
      'reinhardt@moneybutton.com',
      'utf8',
      message,
    ]).toASM();

    //console.log('moneybyttondocs', opReturnDataAsm);
    setOpReturnData(opReturnDataAsm);
  }, [message]);

  function onbuttonclick() {
    //console.log('hit');
    collectIdAndOrPostEachBranch(
      'this was saved from the button on click test',
      true,
      baseURL,
      params,
      '00dce72a9ec6e9abbd4e69161fe9e74504f5eb91cb4c775b03e05a581d5e6035',
    );
  }

  function myOnPaymentCallback(payment) {
    collectIdAndOrPostEachBranch(message, true, baseURL, params, payment.txid);// For some reason this keeps the page constaly on inital load

    console.log('A payment has occurred!', payment); //TODO: Then try to use txid to get the op_return ending hex and convert it to the bpage messages
  }

  return (
    <div className="homepage">
      <h2>IndivinstMoneyButton</h2>
            <button onClick={onbuttonclick}>Button to test</button>

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
