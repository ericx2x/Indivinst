import React, {useState, useEffect} from 'react';
import axios from 'axios';
const {MoneyButtonClient} = require('@moneybutton/api-client');
//const mbClient = new MoneyButtonClient("9becf316ca7bad801f6d30b563e01dd4", "70abe5cd2fff168bba3b6b4e52ffdd11")
const mbClient = new MoneyButtonClient('ab0a912ef51c1cc9bd6d7d9433fbc3c0'); //store this id in a new money button app after testing is done//oauth identifier
const refreshToken = mbClient.getRefreshToken();
var Centrifuge = require('centrifuge');
//import bsv from 'bsv';
let bsv = require('bsv');
let MoneyButton = require('@moneybutton/react-money-button').default;

axios.defaults.withCredentials = true;

const MoneyButtonLogin = () => {
  const [id, setId] = useState('');
  const [userProfile, setUserProfile] = useState('');
  const [balance, setBalance] = useState(0);
  const [opReturnData, setOpReturnData] = useState('');

  const handleMBRequestAuthorization = () => {
    mbClient.requestAuthorization(
      'auth.user_identity:read users.profiles:read users.balance:read',
      'http://localhost:9008/oauth-response-web',
    );

    //TODO: go from here below
    //mbClient.handleAuthorizationResponse().then(() => {
    //mbClient.getIdentity().then(res => {
    //mbClient.getUserProfile(res.id).then(res => {
  };

  const retrieveMbData = async () => {
    window.location.pathname.includes('oauth-response-web') &&
      mbClient.handleAuthorizationResponse();
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
    //mbClient.handleAuthorizationResponse().then(() => {
    //mbClient.getIdentity();
    //console.log('idi', mbClient.getIdentity())
    //});
  };

  const centrifugeCode = () => {
    //TODO: create your own address by following these docs
    //https://docs.moneybutton.com/docs/bsv/bsv-private-key.html
    //then keep watching j.henslee's videos on how to read opreturn data from a bsv address
    //You left off at 3.30 mins in:
    //https://www.youtube.com/watch?v=L2d0Bnapy3k
    const address = '1HJVXv6ftqksZf7yV63vvTh9dAvVgQKeD4';
    const filter = bsv.Address.fromString(address).toJSON().hash;
    console.log('filter', filter);
    const centrifuge = new Centrifuge('wss://socket.whatsonchain.com/mempool');

    centrifuge.on('publish', function (message) {
      //console.log('Data: ' + JSON.stringify(message.data, null, 2));
      const hex = message.data.hex;
      if (hex.includes(filter)){
          console.log(hex);
      }
    });

    centrifuge.on('disconnect', function (ctx) {
      console.log(
        'Disconnected: ' +
          ctx.reason +
          (ctx.reconnect
            ? ', will try to reconnect'
            : ", won't try to reconnect"),
      );
    });

    centrifuge.on('connect', function (ctx) {
      console.log(
        'Connected with client ID ' + ctx.client + ' over ' + ctx.transport,
      );
    });

    centrifuge.connect();

    //var centrifuge = new Centrifuge(
    //'ws://centrifuge.example.com/connection/websocket',
    //);

    //centrifuge.subscribe('news', function (message) {
    //console.log(message);
    //});

    //centrifuge.connect();
  };

  useEffect(() => {
    retrieveMbData();
    mbClient.setRefreshToken(refreshToken);
    //console.log('moneybyttondocs', bsv);
    //
    const opReturnDataAsm = bsv.Script.buildSafeDataOut([
      'reinhardt@moneybutton.com',
      'utf8',
      'Hello. How are you?',
    ]).toASM();

    //console.log('moneybyttondocs', opReturnDataAsm);
    setOpReturnData(opReturnDataAsm);

    centrifugeCode();
  }, []);

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
          to={'reinhardt@moneybutton.com'} //'paymail', 'user ID', 'address', 'or script'
          script={
            //'OP_FALSE OP_RETURN 6d6f6e6579627574746f6e2e636f6d 75746638 68656c6c6f2e20686f772061726520796f753f'
            //
            {opReturnData}
          }
          amount={'.01'}
          currency={'USD'}
        />
      </div>
    </div>
  );
};

export default MoneyButtonLogin;
