import React, {useState, useEffect} from 'react';
import axios from 'axios';
const {MoneyButtonClient} = require('@moneybutton/api-client');
const mbClient = new MoneyButtonClient('ab0a912ef51c1cc9bd6d7d9433fbc3c0'); //store this id in a new money button app after testing is done//oauth identifier
const refreshToken = mbClient.getRefreshToken();
var Centrifuge = require('centrifuge');
let bsv = require('bsv');
let MoneyButton = require('@moneybutton/react-money-button').default;

axios.defaults.withCredentials = true;


//TODO actually make this component polished and usable.
const IndivinstMoneyButton = () => {
  const [id, setId] = useState('');
  const [userProfile, setUserProfile] = useState('');
  const [balance, setBalance] = useState(0);
  const [opReturnData, setOpReturnData] = useState('');

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

  useEffect(() => {
    retrieveMbData();
    mbClient.setRefreshToken(refreshToken);

    let opReturnDataAsm = bsv.Script.buildSafeDataOut([
      'reinhardt@moneybutton.com',
      'utf8',
      'Hello. How are you? Save this address to a mysql database',
    ]).toASM();

    console.log('moneybyttondocs', opReturnDataAsm);
    setOpReturnData(opReturnDataAsm);
  }, []);

  function myOnPaymentCallback(payment) {
    console.log('A psayment has occurred!', payment);
  }

  return (
    <div className="homepage">
      <h2>MoneyButtonLogin </h2>
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
          amount={'0.00000145'} //increase/decrease this depending on the date miners may not accept transactions that are too low.
          currency={'BSV'}
          onPayment={myOnPaymentCallback}
        />
      </div>
    </div>
  );
};

export default IndivinstMoneyButton;
