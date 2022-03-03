import React, {useEffect, useContext} from 'react';
import axios from 'axios';
import {
  AuthenticatedContext,
  IdContext,
  UserProfileContext,
  BalanceContext,
} from '../Indivinst';
//import {getCookie} from '../utils/cookieHelper';

const {MoneyButtonClient} = require('@moneybutton/api-client');
const mbClient = new MoneyButtonClient('ab0a912ef51c1cc9bd6d7d9433fbc3c0'); //TODO: is this safe to keep here?//oauth identifier

//var sha256 = require('sha256');

axios.defaults.withCredentials = true;

const QuickLogin = props => {
  //TODO: create a previous location context to link a user back to their page after getting redirected by the oauth page

  //const [id, setId] = useState('');
  const {Id, setId} = useContext(IdContext);
  //TODO: Get user profile/balance to be usecontext alongside id? or remove them?
  //const [userProfile, setUserProfile] = useState('');
  //const [balance, setBalance] = useState(0);
  //const [opReturnData, setOpReturnData] = useState('');
  const {Authenticated, setAuthenticated} = useContext(AuthenticatedContext);
  const {UserProfile, setUserProfile} = useContext(UserProfileContext);
  const {Balance, setBalance} = useContext(BalanceContext);

  //const mbPromise = MakeQuerablePromise(mbClient.handleAuthorizationResponse());

  const getMBData = async () => {
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
      //document.cookie = `username=${profile.primaryPaymail}`;
      console.log('hi', Authenticated);
    }
    //mbClient.handleAuthorizationResponse().then(() => {
    //mbClient.getIdentity();
    //console.log('idi', mbClient.getIdentity())
    //});
  };

  useEffect(() => {
    getMBData();
  }, []);

  useEffect(async () => {
    //const oauthState = localStorage.getItem('mb_js_client:oauth_state');
    //if (oauthState !== '') {
    const {id} = await mbClient.getIdentity();
    //console.log(`The id is ${id} and the name is ${name}`);

    //if (id !== '') {
    //setAuthenticated(true);
    //}
    //setUserProfile(UserProfile);
  }, [Id, UserProfile, Balance]);

  const handleMBRequestAuthorization = () => {
    mbClient.requestAuthorization(
      'auth.user_identity:read users.profiles:read users.balance:read',
      'http://localhost:9008/oauth-response-web',
    );
    setAuthenticated(true);
  };

  const removeMoneyButtonItemsInLocalStorage = () => {
    window.localStorage.removeItem('mb_js_client:oauth_access_token');
    window.localStorage.removeItem('mb_js_client:oauth_expiration_time');
    window.localStorage.removeItem('mb_js_client:oauth_state');
    window.localStorage.removeItem('mb_js_client:oauth_refresh_token');
    window.localStorage.removeItem('mb_js_client:oauth_redirect_uri');
  };

  const handleLogout = () => {
    removeMoneyButtonItemsInLocalStorage();
    setAuthenticated(false);
  };

  return (
    <div>
      {!Authenticated && (
        <button
          className="pure-button quickLog pure-button-primary logout-button"
          onClick={e => handleMBRequestAuthorization(e)}
          alt="MoneyButton Login">
          Login
        </button>
      )}
      {Authenticated && (
        <button
          className="pure-button quickLog pure-button-primary logout-button"
          onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default QuickLogin;
