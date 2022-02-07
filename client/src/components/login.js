import React, {useContext} from 'react';
import axios from 'axios';
import {AuthenticatedContext} from '../Indivinst';

axios.defaults.withCredentials = true;

const Login = () => {
  const {Authenticated, setAuthenticated} = useContext(AuthenticatedContext);

  return (
    <div className="login">
      {Authenticated && <p>You're logged in.</p>}
      {!Authenticated && <p>You're logged out.</p>}
    </div>
  );
};

export default Login;
