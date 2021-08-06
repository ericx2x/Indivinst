import React, { Component } from 'react';
import axios from 'axios';
const { MoneyButtonClient } = require('@moneybutton/api-client')
//const mbClient = new MoneyButtonClient("9becf316ca7bad801f6d30b563e01dd4", "70abe5cd2fff168bba3b6b4e52ffdd11")
const mbClient = new MoneyButtonClient("115c92e4b0101ca3a7404b472053c8b2")
const refreshToken = mbClient.getRefreshToken();

axios.defaults.withCredentials = true;

  async function retrieveMbData() {

    //await mbClient.handleAuthorizationResponse();
    const { id: userId } = await mbClient.getIdentity()
    const profile = await mbClient.getUserProfile(userId)
    const balance = await mbClient.getBalance(userId)
    //console.log('resp', mbClient.handleAuthorizationResponse())
    //console.log('res', res)
    console.log('id', userId)
    console.log('userProfile ', JSON.stringify(profile))
    console.log('balance ', JSON.stringify(balance))
    //mbClient.handleAuthorizationResponse().then(() => {
      //mbClient.getIdentity();
      //console.log('idi', mbClient.getIdentity())
    //});
  }

class MoneyButtonLogic extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  async componentDidMount(){
  }


  handleMBRequestAuthorization = e => {
    e.preventDefault();
    mbClient.requestAuthorization(
      'auth.user_identity:read users.profiles:read users.balance:read',
      'http://localhost:9008/oauth-response-web'
    )


    //TODO: go from here below
    //mbClient.handleAuthorizationResponse().then(() => {
        //mbClient.getIdentity().then(res => {
          //mbClient.getUserProfile(res.id).then(res => {
  };

  render(){
    retrieveMbData();
    mbClient.setRefreshToken(refreshToken)
    //mbClient.handleAuthorizationResponse().then(() => {
      //mbClient.getIdentity();
      //console.log('idi', mbClient.getIdentity())
    //});

    //let r = Math.random().toString(36).substring(7);

    return (
      <div className="homepage">
        MoneyButtonLogic <br />
        {/*<a href={`https://www.moneybutton.com/oauth/v1/authorize?response_type=code&client_id=9becf316ca7bad801f6d30b563e01dd4&redirect_uri=http://localhost:9008/oauth-response-web&scope=auth.user_identity:read&state=${r}`}>oAuth</a><br />*/}

        <a href='' onClick={this.handleMBRequestAuthorization}>oAuth</a>
      </div>
    );
  }
}

export default MoneyButtonLogic;

