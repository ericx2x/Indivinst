import React, {useEffect} from 'react';
import axios from 'axios';
const {MoneyButtonClient} = require('@moneybutton/api-client');
//const mbClient = new MoneyButtonClient("9becf316ca7bad801f6d30b563e01dd4", "70abe5cd2fff168bba3b6b4e52ffdd11")
const mbClient = new MoneyButtonClient('ab0a912ef51c1cc9bd6d7d9433fbc3c0'); //store this id in a new money button app after testing is done//oauth identifier
const refreshToken = mbClient.getRefreshToken();
//import bsv from 'bsv';
let bsv = require('bsv');
let MoneyButton = require('@moneybutton/react-money-button').default;

axios.defaults.withCredentials = true;

const retrieveMbData = async () => {
  window.location.pathname.includes('oauth-response-web') &&
    mbClient.handleAuthorizationResponse();
  const {id: userId} = await mbClient.getIdentity();
  const profile = await mbClient.getUserProfile(userId);
  const balance = await mbClient.getBalance(userId);
  //console.log('resp', mbClient.handleAuthorizationResponse())
  //console.log('res', res)
  console.log('id', userId);
  console.log('userProfile ', JSON.stringify(profile));
  console.log('balance ', JSON.stringify(balance));
  //mbClient.handleAuthorizationResponse().then(() => {
  //mbClient.getIdentity();
  //console.log('idi', mbClient.getIdentity())
  //});
};

const MoneyButtonLogin = () => {
  const handleMBRequestAuthorization = () => {
    mbClient.requestAuthorization(
      'auth.user_identity:read users.profiles:read users.balance:read',
      'http://localhost:9008/oauth-response-web'
    );

    //TODO: go from here below
    //mbClient.handleAuthorizationResponse().then(() => {
    //mbClient.getIdentity().then(res => {
    //mbClient.getUserProfile(res.id).then(res => {
  };
 useEffect(()=>{

  retrieveMbData();
  mbClient.setRefreshToken(refreshToken);
  //console.log('moneybyttondocs', bsv);
  console.log('moneybyttondocs', bsv.Script.buildSafeDataOut(['moneybutton.com', 'utf8', 'hello. how are you?']).toASM());
  //mbClient.handleAuthorizationResponse().then(() => {
  //mbClient.getIdentity();
  //console.log('idi', mbClient.getIdentity())
  //});

  //let r = Math.random().toString(36).substring(7);

 },[]);

  return (
    <div className="homepage">
      MoneyButtonLogin <br />
      {/*<a href={`https://www.moneybutton.com/oauth/v1/authorize?response_type=code&client_id=f52cf7a08024d7d663e65fecd0152fe7&redirect_uri=http://localhost:9008/oauth-response-web&scope=auth.user_identity:read&state=${r}`}>oAuth</a><br />*/}
      <button onClick={(e) => handleMBRequestAuthorization(e)}>
        oAuth MoneyButton API data retrival
      </button>
      <div>
        <MoneyButton
          to={'reinhardt@moneybutton.com'}//'paymail', 'user ID', 'address', 'or script'
          //script={
            //'OP_FALSE OP_RETURN 6d6f6e6579627574746f6e2e636f6d 75746638 68656c6c6f2e20686f772061726520796f753f'
          //}
          amount={'.01'}
          currency={'USD'}
        />
      </div>
    </div>
  );
};

export default MoneyButtonLogin;

