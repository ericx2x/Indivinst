import React, {useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink,
} from 'react-router-dom';

import {retrievePaths} from './utils/bpagePipelineHelper';
import Bpages from './components/bpages';
import MoneyButtonLogin from './components/MoneyButtonLogin';
//import Login from './components/login';
import AllBpages from './components/allBpages';
import QuickLogin from './components/quickLogin';
import axios from 'axios';
import './App.css';

axios.defaults.withCredentials = true;

export const AuthenticatedContext = React.createContext();

const App = () => {
  const [activeMenu, setActiveMenu] = useState('');
  const [pinBpages, setPinBpages] = useState([]);
  const [Authenticated, setAuthenticated] = useState(false);
  const AuthenticatedContextValue = {Authenticated, setAuthenticated};

  const baseURL = (typeof window !== 'undefined') && (!window.location.href.includes('localhost')) ? 'https://api.indivinst.com' : '';

  useEffect(() => {
    getPinBpages();
  }, []);

  const getPinBpages = async () => {
    const pinBpagesCallback = await axios.get(`${baseURL}/api/bpages/pinBpages/`);

    pinBpagesCallback.data.map(async bpage => {
      const thepath = await retrievePaths(bpage.name, bpage.namepid, baseURL);
      setPinBpages(pinBpages => [...pinBpages, thepath]);
    });
  };

  const handleClick = () => {
    if (activeMenu === 'active') {
      setActiveMenu('');
    } else {
      setActiveMenu('active');
    }
  };

  const toTitleCase = str => {
    if (str) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
    return str;
  };

  const generateChildBpageRoutes = () => {
    const result = [];
    let stringRes = '/:id';

    for (let i = 1; i < 299; i++) {
      stringRes = '/:id' + i + stringRes;
      result.unshift(
        <Route
          path={stringRes}
          key={i}
          render={routeProps => (
            <Bpages
              {...routeProps}
              getPinBpages={getPinBpages}
              setPinBpages={setPinBpages}
              baseURL={baseURL}
              key={window.location.pathname}
            />
          )}
        />,
      );
    }
    return result;
  };

  return (
    <AuthenticatedContext.Provider value={AuthenticatedContextValue}>
      <div id="layout" className={`${activeMenu}`}>
        <div id="main">
          <div className="content">
            <Router>
              <div>
                <a
                  href="#menu"
                  id="menuLink"
                  onClick={() => handleClick()}
                  className={`menu-link`}>
                  <span></span>
                </a>
                <div id="menu">
                  <div className="pure-menu">
                    <NavLink
                      activeClassName="pure-menu-selected"
                      className="pure-menu-heading"
                      to="/">
                      Eric's Bpages
                    </NavLink>
                    <ul className="pure-menu-list">
                      <QuickLogin baseURL={baseURL} setAuthenticated={setAuthenticated} />
                      {/*<li className="pure-menu-item" key="0">
                      <a className="pure-menu-link" href={`/login`}>
                        Login
                      </a>
                    </li>*/}
                      <li className="pure-menu-item" key="1">
                        <a className="pure-menu-link" href={`/allBpages`}>
                          All Bpages
                        </a>
                      </li>
                      {pinBpages.map((bpage, index) => {
                        return (
                          <li className="pure-menu-item" key={index}>
                            <a className="pure-menu-link" href={`/${bpage.url}`}>
                              {toTitleCase(bpage.name)}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                <Switch>
                  {/* <Route
                    path={'/login'}
                    render={routeProps => <Login {...routeProps} baseURL={baseURL} />}
                  />*/}
                  <Route
                    path={'/moneybuttonlogin'}
                    render={routeProps => <MoneyButtonLogin {...routeProps} baseURL={baseURL} />}
                  />
                  <Route
                    path={'/allbpages'}
                    render={routeProps => (
                      <AllBpages
                        {...routeProps}
                        baseURL={baseURL}
                        toTitleCase={toTitleCase()}
                      />
                    )}
                  />
                  {generateChildBpageRoutes()}
                  <Route
                    path={'/:id'}
                    render={routeProps => (
                      <Bpages
                        {...routeProps}
                        baseURL={baseURL}
                        getPinBpages={getPinBpages}
                        setPinBpages={setPinBpages}
                      />
                    )}
                  />
                  <Route
                    path={'/'}
                    render={() => (
                      <div className="vertical-center">
                        <h3>This is Eric Lima's bpages website.</h3>
                      </div>
                    )}
                  />
                  <Redirect from="*" to="/" />
                </Switch>
              </div>
            </Router>
          </div>
        </div>
      </div>
    </AuthenticatedContext.Provider>
  );
};

export default App;
