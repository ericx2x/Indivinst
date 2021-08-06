import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import {AuthenticatedContext} from '../Indivinst';

var sha256 = require('sha256');

axios.defaults.withCredentials = true;

const QuickLogin = props => {
  const {Authenticated, setAuthenticated} = useContext(AuthenticatedContext);
  const [pass, setPass] = useState('');
  const [incorrectPassword, setIncorrectPassword] = useState('');

  useEffect(() => {
    axios
      .get(`${props.baseURL}/api/password/${pass}`)
      .then(response => {
        if (response.data.logged) {
          setAuthenticated(true);
        }
      })
      .catch(function (error) {
        return JSON.stringify(error);
      });
  }, []);

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
    axios
      .post(`${props.baseURL}/api/password/logout`)
      .then(response => {
        setAuthenticated(false);
      })
      .catch(function (error) {
        return JSON.stringify(error);
      });
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
        Logout
      </button>
    </div>
  );
};

export default QuickLogin;
