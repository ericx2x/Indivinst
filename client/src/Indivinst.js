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
//import MoneyButtonLogin from './components/moneyButtonLogin';
import Login from './components/login';
import Instructions from './components/instructions';
import AllBpages from './components/allBpages';
import MoneyButtonQuickLogin from './components/moneyButtonQuickLogin';
import MetaHead from './components/MetaHead';
import axios from 'axios';
import './Indivinst.css';

axios.defaults.withCredentials = true;

export const AuthenticatedContext = React.createContext();
export const IdContext = React.createContext();
export const UserProfileContext = React.createContext();
export const BalanceContext = React.createContext();

const App = () => {
  const [activeMenu, setActiveMenu] = useState('');
  const [pinBpages, setPinBpages] = useState([]);
  const [Authenticated, setAuthenticated] = useState(
    window.localStorage.getItem('mb_js_client:oauth_state') ? true : false,
  );
  const AuthenticatedContextValue = {Authenticated, setAuthenticated};
  const [Id, setId] = useState('');
  const IdContextValue = {Id, setId};
  const [UserProfile, setUserProfile] = useState('');
  const UserProfileContextValue = {UserProfile, setUserProfile};
  const [Balance, setBalance] = useState('');
  const BalanceContextValue = {Balance, setBalance};

  const baseURL =
    typeof window !== 'undefined' && !window.location.href.includes('localhost')
      ? 'https://api.indivinst.com'
      : '';

  useEffect(() => {
    //getPinBpages();//may need to reenable this later
  }, []);

  const getPinBpages = async () => {
    const pinBpagesCallback = await axios.get(
      `${baseURL}/api/bpages/pinBpages/`,
    );

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
      <IdContext.Provider value={IdContextValue}>
        <UserProfileContext.Provider value={UserProfileContextValue}>
          <BalanceContext.Provider value={BalanceContextValue}>
            <MetaHead />
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
                            Indivinst
                          </NavLink>
                          <ul className="pure-menu-list">
                            <MoneyButtonQuickLogin
                              baseURL={baseURL}
                              setAuthenticated={setAuthenticated}
                              setId={setId}
                              setUserProfile={setUserProfile}
                              setBalance={setBalance}
                            />
                            <li className="pure-menu-item" key="1">
                              <a
                                className="pure-menu-link"
                                href={`/listPaymails`}>
                                List Paymails
                              </a>
                            </li>
                            <li className="pure-menu-item" key="1">
                              <a
                                className="pure-menu-link"
                                href={`/instructions`}>
                                Instructions
                              </a>
                            </li>
                            {pinBpages.map((bpage, index) => {
                              return (
                                <li className="pure-menu-item" key={index}>
                                  <a
                                    className="pure-menu-link"
                                    href={`/${bpage.url}`}>
                                    {toTitleCase(bpage.name)}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                      <Switch>
                        <Route
                          path={'/MoneyButtonLogin'}
                          render={routeProps => (
                            <nLogin {...routeProps} baseURL={baseURL} />
                          )}
                        />
                        <Route
                          path={'/oauth-response-web'}
                          render={routeProps => (
                            <Login {...routeProps} baseURL={baseURL} />
                          )}
                        />
                        <Route
                          path={'/oauth/v1/authorize'}
                          render={routeProps => (
                            <Login {...routeProps} baseURL={baseURL} />
                          )}
                        />
                        <Route
                          path={'/listPaymails'}
                          render={routeProps => (
                            <AllBpages
                              {...routeProps}
                              baseURL={baseURL}
                              toTitleCase={toTitleCase()}
                            />
                          )}
                        />
                        <Route
                          path={'/instructions'}
                          render={routeProps => (
                            <Instructions
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
                              <h3>
                                This is the individual institute website
                                homepage.{' '}
                              </h3>
                              <p>
                                Login and write your paymail in the first path
                                to start writing. Or you can read what other
                                people have written by clicking the all bpages
                                button on the sidebar.
                              </p>
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
          </BalanceContext.Provider>
        </UserProfileContext.Provider>
      </IdContext.Provider>
    </AuthenticatedContext.Provider>
  );
};

export default App;
