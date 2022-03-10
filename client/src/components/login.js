import React, {useState, useContext} from 'react';
import axios from 'axios';
import {AuthenticatedContext} from '../Indivinst';

axios.defaults.withCredentials = true;

const Login = () => {
  const {Authenticated} = useContext(AuthenticatedContext);
  const [refreshState, setRefreshState] = useState(false);

  setTimeout(() => {
    setRefreshState(!refreshState);
  }, 2000);

  //console.log(
    //'auth',
    //Authenticated
  //);
  //console.log(
    //'yes',
    //window.localStorage.getItem('mb_js_client:oauth_access_token'),
  //);
  return (
    <div className="login">
      {Authenticated ? <p>You're logged in.</p> : <p>You're logged out.</p>}
    </div>
  );
};

export default Login;
