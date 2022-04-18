import React, {useState, useContext} from 'react';
import axios from 'axios';
import {AuthenticatedContext} from '../Indivinst';
import {useHistory} from 'react-router-dom';

const moneyButtonRedirect =
  typeof window !== 'undefined' && window.localStorage.getItem('currentPage');

axios.defaults.withCredentials = true;

const Login = () => {
  const {Authenticated} = useContext(AuthenticatedContext);
  const [refreshState, setRefreshState] = useState(false);
  const history = useHistory();

  var url_string = window.location.href; //window.location.href
  var url = new URL(url_string);
  var code = url.searchParams.get('code');
  typeof window !== 'undefined' &&
    window.localStorage.setItem('mb_oauth_code', code);
  history.push(moneyButtonRedirect);

  setTimeout(() => {
    setRefreshState(!refreshState);
  }, 2000);

  return (
    <div className="login">
      {Authenticated ? <p>You're logged in.</p> : <p>You're logged out.</p>}
    </div>
  );
};

export default Login;
