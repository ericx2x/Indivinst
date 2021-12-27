import React, {useState, useEffect} from 'react';
import axios from 'axios';
const {MoneyButtonClient} = require('@moneybutton/api-client');
//const mbClient = new MoneyButtonClient("9becf316ca7bad801f6d30b563e01dd4", "70abe5cd2fff168bba3b6b4e52ffdd11")
const mbClient = new MoneyButtonClient('ab0a912ef51c1cc9bd6d7d9433fbc3c0'); //store this id in a new money button app after testing is done//oauth identifier
const refreshToken = mbClient.getRefreshToken();
//var Centrifuge = require('centrifuge');
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

  //const bitBusCode = () => {
    //const query = {
      //q: {
        //find: {
          //'out.s2': '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut',
          //'blk.i': {$gt: 609000},
          //// "$text": {$search: "tetrissvscorex3x"}
          //// used to be the above in find
        //},
        //sort: {'blk.i': 1},
        //project: {blk: 1, 'tx.h': 1, 'out.s4': 1, 'out.o1': 1},
      //},
    //};
    //fetch('https://txo.bitbus.network/block', {
      //method: 'post',
      //headers: {'Content-type': 'application/json; charset=utf-8'},
      //body: JSON.stringify(query),
    //}).then(res => {
      //console.log('res', res);
      //console.log('process.stdout', process.stdout);
      ////res.body.pipe(process.stdout);
    //});
  //};

  //const centrifugeCodeScaleTransactions = () => {
    //let txObj = [];
    //const getBlock = async (height, hash) => {
      //let res,
        //tx = [];
      //if (height) {
        //res = await (
          //await fetch(
            //`https://api.whatsonchain.com/v1/bsv/main/block/height/${height}`,
          //)
        //).json();
      //} else if (hash) {
        //res = await (
          //await fetch(
            //`https://api.whatsonchain.com/v1/bsv/main/block/hash/${hash}`,
          //)
        //).json();
      //}
      //res.tx.forEach(t => {
        //tx.push(t);
      //});

      //if (res.pages && res.pages.uri.length) {
        //const pages = res.pages.uri;
        //for (let p of pages) {
          //const res = await (
            //await fetch(`https://api.whatsonchain.com/v1/bsv/main${p}`)
          //).json();

          //res.forEach(t => {
            //tx.push(t);
          //});
        //}
      //}
      //console.log('tx', {tx});

      //const looptimes = parseInt(tx.length / 20);
      //const remainder = tx.length % 20;
      //console.log('xlr', {looptimes}, {remainder});

      //let x = 0;
      //let temp = [];
      //for (let i = 0; i < looptimes; i++) {
        //for (let j = 0; j < 20; j++) {
          //temp.push(tx[x]);
          //x++;
        //}
        //const res = await (
          //await fetch(`https://api.whatsonchain.com/v1/bsv/main/txs/hex`, {
            //method: 'post',
            //body: JSON.stringify({txids: temp}),
          //})
        //).json();
        //console.log('dsRes', {res});
        //temp = [];

        //res.forEach(t => {
          //if (t.hex.includes('73656e7369626c65')) {
            //txObj.push({
              //txid: t.txid,
              //hex: t.hex,
            //});
          //}
        //});
        //console.log({txObj});
      //}
      //temp = [];

      //for (let k = tx.length - 1; k > tx.length - remainder; k--) {
        //temp.push(tx[k]);
      //}
      ////console.log('last', {temp});

      ////reimplemented
      //const remainderRes = await (
        //await fetch(`https://api.whatsonchain.com/v1/bsv/main/txs/hex`, {
          //method: 'post',
          //body: JSON.stringify({txids: temp}),
        //})
      //).json();
      //console.log('dsRemainderRes', {res});
      //temp = [];

      //remainderRes.forEach(t => {
        //if (t.hex.includes('73656e7369626c65')) {
          //txObj.push({
            //txid: t.txid,
            //hex: t.hex,
          //});
        //}
      //});
      //console.log({txObj});

      //if (res.nextblockhash) {
        //await getBlock(null, res.nextblockhash);
      //}
    //};

    //getBlock(707402);
  //};

  //const centrifugeCode = () => {
    ////https://docs.moneybutton.com/docs/bsv/bsv-private-key.html
    ////then keep watching j.henslee's videos on how to read opreturn data from a bsv address
    ////You left off at 3.30 mins in:
    ////https://www.youtube.com/watch?v=L2d0Bnapy3k
    ////const address = '1HJVXv6ftqksZf7yV63vvTh9dAvVgQKeD4'; //this might not be necessary to find transactions. May not need this unless you can find this autiomatically via moneybutton?
    ////
    ////
    ////01000000017f9fedabc5a811d611cfe4166842799bcefb5561080f6c2df69fb9f70610716e010000006b483045022100bdcd0db3f14ebe327ff29c9fb2547cc9c37b13e50af438a2cb76a47f0daec13302207914b31b0e40444630dc5010f45dd07b4f6f8c84cb087a80965fd4d71d756e54412102b7c6ec9b7a6a4f50311caa0d699baffeb23b9474ecc75553079e1e27f2474b52ffffffff02670c0000000000001976a914a9c0392824d6f721c5e670f3c4921577c947a68a88acb60f0000000000001976a914bee49e36b5296942e78fccfc77e7f2fe5031afc588ac00000000
    ////
    ////
    ////

    //const address = '1GUZUKvLseDYzByZbwnpX6GHBqcUjn1zBL';
    //const filter = bsv.Address.fromString(address).toJSON().height;
    ////https://api.whatsonchain.com/v1/bsv/<network>/block/height/<height>
    ////console.log('filter', filter);
    //const centrifuge = new Centrifuge('wss://socket.whatsonchain.com/mempool'); //try blcokheaders later
    //centrifuge.on('publish', function (message) {
      ////console.log('Data: ' + JSON.stringify(message.data, null, 2));
      //const hex = message.data.hex;
      //if (hex.includes(filter)) {
        //console.log('hex');
        //console.log(hex);
        //const bsvtx = bsv.Transaction(hex);
        //console.log('bsvtx: ', bsvtx);
        //const satoshis = bsvtx.outputs.find(
          //out => out.script.chunks[2].buf.toString('hex') === filter,
        //).satoshis; //here you can change this to more data retrievals like custom scripts but check their docs.
        //const scriptData = bsvtx.outputs
          //.find(out => out.script.chunks[2].buf.toString('hex') === filter)
          //.script.chunks[3].toString(); //here you can change this to more data retrievals like custom scripts but check their docs.
        //console.log(`I was paid ${satoshis} satoshis.`);
        //console.log(`scriptData: ${scriptData} satoshis.`);
        //console.log(scriptData);
      //}
    //});
    //centrifuge.on('disconnect', function (ctx) {
      //console.log(
        //'Disconnected: ' +
          //ctx.reason +
          //(ctx.reconnect
            //? ', will try to reconnect'
            //: ", won't try to reconnect"),
      //);
    //});
    //centrifuge.on('connect', function (ctx) {
      //console.log(
        //'Connected with client ID ' + ctx.client + ' over ' + ctx.transport,
      //);
    //});
    //centrifuge.connect();
    ////var centrifuge = new Centrifuge(
    ////'ws://centrifuge.example.com/connection/websocket',
    ////);
    ////centrifuge.subscribe('news', function (message) {
    ////console.log(message);
    ////});
    ////centrifuge.connect();
  //};

  //TODO: maybe a third centrifugecode functoin that will retrieve the transaction id given by the myOnPaymentCallback function

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

    console.log('moneybyttondocs', opReturnDataAsm);
    setOpReturnData(opReturnDataAsm);

    //bitBusCode();
    //centrifugeCodeScaleTransactions();
    //centrifugeCode();
  }, []);

  //const myCustomCallback = payment => {
    //console.log('A payment has occurred!', payment);
  //};

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
