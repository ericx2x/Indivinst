import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import {
  AuthenticatedContext,
  IdContext,
  UserProfileContext,
  BalanceContext,
} from '../Indivinst';
const {MoneyButtonClient} = require('@moneybutton/api-client');
const mbClient = new MoneyButtonClient('ab0a912ef51c1cc9bd6d7d9433fbc3c0'); //TODO: is this safe to keep here?//oauth identifier

var sha256 = require('sha256');

axios.defaults.withCredentials = true;

const QuickLogin = props => {
  //TODO: create a previous location context to link a user back to their page after getting redirected by the oauth page

  //const [id, setId] = useState('');
  const {Id, setId} = useContext(IdContext);
  //TODO: Get user profile/balance to be usecontext alongside id? or remove them?
  //const [userProfile, setUserProfile] = useState('');
  const {UserProfile, setUserProfile} = useContext(UserProfileContext);
  //const [balance, setBalance] = useState(0);
  const {Balance, setBalance} = useContext(BalanceContext);
  const [opReturnData, setOpReturnData] = useState('');
  const {Authenticated, setAuthenticated} = useContext(AuthenticatedContext);
  const [pass, setPass] = useState('');
  const [incorrectPassword, setIncorrectPassword] = useState('');

  useEffect(async () => {
    //axios
    //.get(`${props.baseURL}/api/password/${pass}`)
    //.then(response => {
    //if (response.data.logged) {
    //setAuthenticated(true);
    //}
    //})
    //.catch(function (error) {
    //return JSON.stringify(error);
    //});
    //
    //
    //
    //console.log(
    //'mbClient.handleAuthorizationResponse()',
    //await mbClient.handleAuthorizationResponse(),
    //);
    if (
      window.location.pathname.includes('oauth-response-web') &&
      mbClient.handleAuthorizationResponse()
    ) {
      const {id: userId} = await mbClient.getIdentity();
      const profile = await mbClient.getUserProfile(userId);
      const balance = await mbClient.getBalance(userId);
      setId(userId);
      setUserProfile(JSON.stringify(profile));
      setBalance(JSON.stringify(balance));
    }
  }, []);

  useEffect(() => {
    //console.log('auth', Authenticated);
    //console.log('id', Id);
    //console.log('userProfile', UserProfile);
    //console.log('balance', Balance);
    setAuthenticated(true);
  }, [Id, UserProfile, Balance]);

  const handleMBRequestAuthorization = () => {
    mbClient.requestAuthorization(
      'auth.user_identity:read users.profiles:read users.balance:read',
      'http://localhost:9008/oauth-response-web',
    );
  };

  const handleSubmitPass = e => {
    axios
      .post(`${props.baseURL}/api/password`, {password: sha256(pass)})
      .then(response => {
        if (response.data === 'logged') {
          setAuthenticated(true);
        } else {
          setIncorrectPassword("You've entered an incorrect password.");
          setTimeout(() => {
            setIncorrectPassword('');
          }, 2000);
        }
      })
      .catch(function (error) {
        return JSON.stringify(error);
      });
    e.preventDefault();
  };

  const handleLogout = () => {
    //axios
    //.post(`${props.baseURL}/api/password/logout`)
    //.then(response => {
    //setAuthenticated(false);
    //})
    //.catch(function (error) {
    //return JSON.stringify(error);
    //});
  };

  let passwordShownStyle = {
    display: !Authenticated ? 'block' : 'none',
  };

  let hidden = {
    display: !Authenticated ? 'none' : 'block',
  };

  return (
    <div>
      <form
        style={passwordShownStyle}
        method="get"
        className="pure-form pure-form-aligned"
        onSubmit={handleSubmitPass}>
        <fieldset className="quickLog">
          <div className="pure-control-group">
            <div className="pure-control-group">
              <button
                //style={hidden}
                className="pure-button quickLog pure-button-primary logout-button"
                onClick={e => handleMBRequestAuthorization(e)}
                alt="MoneyButton Login">
                xMoneyButton Login
              </button>
              <input
                onChange={event => setPass(event.target.value)}
                id="quickpassenter"
                type="password"
                value={pass}
                placeholder="Quick Login"
              />
              <p className="verificationMessage"> {incorrectPassword} </p>
            </div>
          </div>
        </fieldset>
      </form>
      <button
        style={hidden}
        className="pure-button quickLog pure-button-primary logout-button"
        onClick={handleLogout}>
        MoneyButton Logout
      </button>
    </div>
  );
};

export default QuickLogin;
