import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import {
  AuthenticatedContext,
  IdContext,
  UserProfileContext,
  BalanceContext,
} from '../Indivinst';
//import {getCookie} from '../utils/cookieHelper';
import {AuthUser} from '../utils/moneyButtonHelper';
var config = require('../config/configFront.json');

const {MoneyButtonClient} = require('@moneybutton/api-client');
const moneyButtonKey =
  typeof window !== 'undefined' && !window.location.href.includes('localhost')
    ? config.moneybuttonProductionWallet
    : config.moneybuttonLocalhostWallet;
typeof window !== 'undefined' &&
  !window.location.href.includes('oauth-response-web') &&
  window.localStorage.setItem('currentPage', window.location.pathname);

//const moneyButtonRedirect =
//typeof window !== 'undefined' && window.localStorage.getItem('currentPage');

const moneyButtonRedirect =
  typeof window !== 'undefined' && !window.location.href.includes('localhost')
    ? 'https://indivinst.com/oauth-response-web'
    : 'http://localhost:9008/oauth-response-web';

const mbClient = new MoneyButtonClient(moneyButtonKey);

//var sha256 = require('sha256');

axios.defaults.withCredentials = true;

const QuickLogin = props => {
  const [refreshState, setRefreshState] = useState(false);
  setTimeout(() => {
    setRefreshState(!refreshState);
  }, 2000);

  const {Authenticated, setAuthenticated} = useContext(AuthenticatedContext);

  const setRefreshData = async () => {
    try {
      typeof window !== 'undefined' &&
        window.localStorage.getItem('mb_js_client:oauth_state') &&
        (await mbClient.authorizeWithAuthFlowResponse(
          {
            code: window.localStorage.getItem('mb_oauth_code'),
            state: window.localStorage.getItem('mb_js_client:oauth_state'),
          },
          window.localStorage.getItem('mb_js_client:oauth_state'),
          moneyButtonRedirect,
        ));
      const refreshToken = mbClient.getRefreshToken();
      mbClient.setRefreshToken(refreshToken);
    } catch (e) {
      console.log('error: ', e);
    }
  };

  useEffect(() => {
    setRefreshData();
  }, []);

  const handleMBRequestAuthorization = () => {
    mbClient.requestAuthorization(
      'auth.user_identity:read users.profiles:read users.balance:read',
      moneyButtonRedirect,
    );
    setRefreshData();
    //AuthUser();
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
      {!Authenticated ? (
        <button
          className="pure-button quickLog pure-button-primary logout-button"
          onClick={e => handleMBRequestAuthorization(e)}
          alt="MoneyButton Login">
          Login
        </button>
      ) : (
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
