import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {AuthenticatedContext} from '../Indivinst';

axios.defaults.withCredentials = true;

const Login = () => {
  const [loginStatus, setLoginStatus] = useState(false);
  const {Authenticated, setAuthenticated} = useContext(AuthenticatedContext);

  //useEffect( () => {
    //setTimeout(()=>{
    //console.log('authenticated', Authenticated);
    //},1000);
    ////setLoginStatus(!loginStatus);
    //const hasItem =
      //window.localStorage.getItem('mb_js_client:oauth_access_token') !== ''
        //? true
        //: false;
    //setLoginStatus(hasItem);
  //}, []);

  return (
    <div className="login">
      {Authenticated ? <p>You're logged in.</p> : <p>You're logged out.</p>}
    </div>
  );
};

export default Login;
