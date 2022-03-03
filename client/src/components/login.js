import React, {useContext} from 'react';
import axios from 'axios';
import {AuthenticatedContext} from '../Indivinst';

axios.defaults.withCredentials = true;

const Login = () => {
  const {Authenticated} = useContext(AuthenticatedContext);

  return (
    <div className="login">
      {Authenticated ? <p>You're logged in.</p> : <p>You're logged out.</p>}
    </div>
  );
};

export default Login;
