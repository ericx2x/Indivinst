import React, {useState, useEffect} from 'react';
import axios from 'axios';
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

axios.defaults.withCredentials = true;

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

  //const updateBpageAndVerification = async (passedUpdateData, baseURL, params, txid) => {
  //collectIdAndOrPostEachBranch(
  //passedUpdateData,
  //true,
  //baseURL,
  //params,
  //txid
  //);

  ////setVerificationMessage('Message was saved.');
  ////setValue(unescape(value));
  ////setTimeout(() => {
  ////setVerificationMessage('');
  ////}, 2000);
  //};

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

  const retrieveTxIdData = async (txid) => {
    //const currentPageTxId = await axios.get(
    //`${params.baseURL}/api/bpages/namepid/${paths[i]}/${pid}`,
    //);
    //console.log('currentPageTxId', currentPageTxId);
      console.log('lsakjd', txid);
    const email = 'ericjlima@gmail.com';
    const password = 'water123';
    if (txid) {
      const op_returnData = await axios.get(
        `https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txid}`, { email, password }, { withCredentials: false }
      );
      console.log('op_returnData', op_returnData);
    }
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
    console.log('theResponse', response);
      //console.log('theresponseidakjd', response.datatxid);
    retrieveTxIdData(response.data[0].transaction_id);
  }, []);

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
      'message value data',
      true,
      baseURL,
      params,
      '00dce72a9ec6e9abbd4e69161fe9e74504f5eb91cb4c775b03e05a581d5e6035',
    );
  }

  function myOnPaymentCallback(payment) {
    //console.log('baseURL', baseURL);
    //console.log('params', params);
    //updateBpageAndVerification(payment.txid, baseURL, params, payment.txid);
    collectIdAndOrPostEachBranch(message, true, baseURL, params, payment.txid);

    console.log('A payment has occurred!', payment); //TODO: Then try to use txid to get the op_return ending hex and convert it to the bpage messages
  }

  return (
    <div className="homepage">
      <h2>BpageMoneyButton</h2>
      <button onClick={onbuttonclick}>Button to test</button>
      <br />
      Login Credentials:
      <br />
      <b>Id:</b>
      {id}
      <br />
      <b>User Profile: </b>
      {userProfile}
      <br />
      <b>Balance: </b>
      {balance}
      <br />
      <button onClick={e => handleMBRequestAuthorization(e)}>
        oAuth MoneyButton API data retrival
      </button>
      <div>
        <h3>opReturnDataTest</h3>
        {opReturnData}
        <MoneyButton
          to={opReturnData} //address of an address when sending a tx back to reinhardt@moneybutton.com
          amount={'0.00000105'} //increase/decrease this depending on the date miners may not accept transactions that are too low.
          currency={'BSV'}
          onPayment={myOnPaymentCallback}
        />
      </div>
    </div>
  );
};

export default IndivinstMoneyButton;
