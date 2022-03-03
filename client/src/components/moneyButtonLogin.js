import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {
  AuthenticatedContext,
  IdContext,
  UserProfileContext,
  BalanceContext,
} from '../Indivinst';
const {MoneyButtonClient} = require('@moneybutton/api-client');
//const mbClient = new MoneyButtonClient("9becf316ca7bad801f6d30b563e01dd4", "70abe5cd2fff168bba3b6b4e52ffdd11")
const mbClient = new MoneyButtonClient('ab0a912ef51c1cc9bd6d7d9433fbc3c0'); //TODO: is this safe to keep here?//oauth identifier
const refreshToken = mbClient.getRefreshToken();
//var Centrifuge = require('centrifuge');
//import bsv from 'bsv';
let bsv = require('bsv');
let MoneyButton = require('@moneybutton/react-money-button').default;

axios.defaults.withCredentials = true;

const MoneyButtonLogin = () => {
  const [id, setId] = useState('');
  //const [userProfile, setUserProfile] = useState('');
  //const [balance, setBalance] = useState(0);
  const [opReturnData, setOpReturnData] = useState('');
  const {Authenticated, setAuthenticated} = useContext(AuthenticatedContext);
  const {UserProfile, setUserProfile} = useContext(UserProfileContext);
  const {Balance, setBalance} = useContext(BalanceContext);

  const handleMBRequestAuthorization = () => {
    mbClient.requestAuthorization(
      'auth.user_identity:read users.profiles:read users.balance:read',
      'http://localhost:9008/oauth-response-web',
    );
  };

  const retrieveMbData = async () => {
    if (
      window.location.pathname.includes('oauth-response-web') &&
      mbClient.handleAuthorizationResponse()
    ) {
      const {id: userId} = await mbClient.getIdentity();
      const profile = await mbClient.getUserProfile(userId);
      const balance = await mbClient.getBalance(userId);
      //console.log('resp', mbClient.handleAuthorizationResponse())
      //console.log('res', res)
      //console.log('id', userId);
      //console.log('userProfile ', JSON.stringify(profile));
      //console.log('balance ', JSON.stringify(balance));
      setId(userId);
      setUserProfile(JSON.stringify(profile));
      setBalance(JSON.stringify(balance));
      document.cookie = `username=${profile.primaryPaymail}`;
    }
    //mbClient.handleAuthorizationResponse().then(() => {
    //mbClient.getIdentity();
    //console.log('idi', mbClient.getIdentity())
    //});
  };

  useEffect(() => {
    retrieveMbData();
    mbClient.setRefreshToken(refreshToken);
    //console.log('moneybyttondocs', bsv);
    //
    let opReturnDataAsm = bsv.Script.buildSafeDataOut([
      'reinhardt@moneybutton.com',
      'utf8',
      'Hello. How are you? Save this address to a mysql database',
    ]).toASM();

    //while (opReturnDataAsm.charAt(0) === '0') {
    //opReturnDataAsm = opReturnDataAsm.substring(1);
    //}

    //console.log('moneybyttondocs', opReturnDataAsm);
    setOpReturnData(opReturnDataAsm);

    //setAuthenticated(true);

    //bitBusCode();
    //centrifugeCodeScaleTransactions();
    //centrifugeCode();
  }, []);

  //useEffect(() => {
  //setAuthenticated(true);
  //}, []);

  //console.log('id', id);

  function myOnPaymentCallback(payment) {
    console.log('A psayment has occurred!', payment);
  }

  return (
    <div className="homepage">
      <h2>MoneyButtonLogin </h2>
      <br />
      {/*<a href={`https://www.moneybutton.com/oauth/v1/authorize?response_type=code&client_id=f52cf7a08024d7d663e65fecd0152fe7&redirect_uri=http://localhost:9008/oauth-response-web&scope=auth.user_identity:read&state=${r}`}>oAuth</a><br />*/}
      Login Credentials:
      <br />
      <b>Id:</b>
      {id}
      <br />
      <b>User Profile: </b>
      {UserProfile}
      <br />
      <b>Balance: </b>
      {Balance}
      <br />
      <button onClick={e => handleMBRequestAuthorization(e)}>
        oAuth MoneyButton API data retrival
      </button>
      <div>
        <h3>opReturnDataTest</h3>
        {opReturnData}
        <MoneyButton
          //to={'reinhardt@moneybutton.com'} //'paymail', 'user ID', 'address', 'or script'
          //to={'1GUZUKvLseDYzByZbwnpX6GHBqcUjn1zBL'} //address of an address when sending a tx back to reinhardt@moneybutton.com
          to={opReturnData} //address of an address when sending a tx back to reinhardt@moneybutton.com
          //script={opReturnData}
          //script={
          //'OP_FALSE OP_RETURN 6d6f6e6579627574746f6e2e636f6d 75746638 68656c6c6f2e20686f772061726520796f753f'
          //}
          amount={'0.00000145'} //increase/decrease this depending on the date miners may not accept transactions that are too low.
          currency={'BSV'}
          onPayment={myOnPaymentCallback}
        />
      </div>
    </div>
  );
};

export default MoneyButtonLogin;
