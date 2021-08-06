import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import {AuthenticatedContext} from '../Indivinst';

axios.defaults.withCredentials = true;

const AllBpages = props => {
  const [bpages, setBpages] = useState([]);
  const {Authenticated} = useContext(AuthenticatedContext);

  useEffect(() => {
    if (Authenticated) {
      fetch(`${props.baseURL}/api/bpages`)
        .then(res => res.json())
        .then(resbpages => {
          setBpages(resbpages);
        });
    } else {
      fetch(`${props.baseURL}/api/bpages/publicBpages`)
        .then(res => res.json())
        .then(resbpages => {
          setBpages(resbpages);
        });
    }
  }, [Authenticated]);

  const toTitleCase = str => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  return (
    <div className="allbpages">
      <div className="header">
        <h1>All Bpages</h1>
        <br />
      </div>
      {bpages.map((bpage, index) => (
        <li className="pure-menu-item" key={index}>
          <a className="pure-menu-link" href={`/${bpage.name}`}>
            {toTitleCase(bpage.name)}
          </a>
        </li>
      ))}
    </div>
  );
};

export default AllBpages;
