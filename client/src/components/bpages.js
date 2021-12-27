import React, {useState, useEffect, useRef, useContext} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {checkIfBpageExists} from '../utils/bpagePipelineHelper';
import {AuthenticatedContext} from '../Indivinst';
import IndivinstMoneyButton from './indivinstMoneyButton';
import {collectIdAndOrPostEachBranch} from '../utils/bpagePipelineHelper';

axios.defaults.withCredentials = true;

const Bpages = props => {
  const [pinnedBpage, setPinnedBpage] = useState(false);
  const [isPrivateBpage, setIsPrivateBpage] = useState(0);
  const [privateText, setPrivateText] = useState('Private Mode is Off');
  const [verificationMessage, setVerificationMessage] = useState(null);
  const [dateModified, setDateModified] = useState(null);
  const [dateCreated, setDateCreated] = useState(null);
  const [childBpages, setChildBpages] = useState([]);
  const [loadOnce, setLoadOnce] = useState(false);
  const [value, setValue] = useState('');
  const [dataCurrentBpage, setDataCurrentBpage] = useState({});

  const textAreaRef = useRef(null);

  const {Authenticated} = useContext(AuthenticatedContext);

  useEffect(() => {
    setChildBpages([]); //This line resolves a bug where the childbpages dont render. Not sure why. Guess you have to do this and it's a weird oddity of React.
    getBpageData();
  }, []);

  useEffect(async () => {
    if (dataCurrentBpage.data) {
      const getPin = await getPinBpage(dataCurrentBpage.data[0].id);
      setPinnedBpage(getPin);
    }
  }, [dataCurrentBpage]);

  useEffect(() => {
    const e = {};
    e.preventDefault = () => {
      return false;
    };

    const waitTwoSecondsBeforeSubmitting = setTimeout(() => {
      if (!loadOnce) {
        setLoadOnce(true);
      } else {
        handleSubmit(e);
      }
    }, 1000);
    return () => clearTimeout(waitTwoSecondsBeforeSubmitting);
  }, [value]);

  const handleKeyPress = event => {
    if (event.key === 'Enter' && event.shiftKey) {
      var firstSearchString = '<br />';
      const field = document.getElementById('message_textarea');
      insertAtCursor(field, firstSearchString);
    }
  };

  const insertAtCursor = (myField, myValue) => {
    if (myField.selectionStart || myField.selectionStart === '0') {
      var startPos = myField.selectionStart;
      var endPos = myField.selectionEnd;
      myField.value =
        myField.value.substring(0, startPos) +
        myValue +
        myField.value.substring(endPos, myField.value.length);
      myField.selectionStart = startPos + myValue.length;
      myField.selectionEnd = startPos + myValue.length;
    } else {
      myField.value += myValue;
    }
  };

  const getChildBpages = async currentBpageData => {
    try {
      const response = await axios.get(
        `${props.baseURL}/api/bpages/children/${currentBpageData.id}`,
      );
      const children = response.data;
      let addChild;
      children.forEach(e => {
        addChild = childBpages;
        addChild.push(e.name);
      });
      if (!!children.length) setChildBpages(addChild);
    } catch (error) {
      console.error(error);
    }
  };

  const getBpageData = async () => {
    try {
      let response;
      const paths = Object.values(props.match.params);
      let pid;
      for (let i = 0; i < paths.length; i++) {
        if (i === 0) {
          pid = 0;
          response = await axios.get(
            `${props.baseURL}/api/bpages/namepid/${paths[i]}/${pid}`,
          );
          !!response.data[0] && (pid = response.data[0].id);
        } else {
          response = await axios.get(
            `${props.baseURL}/api/bpages/namepid/${paths[i]}/${pid}`,
          );
          !!response.data[0] && (pid = response.data[0].id);
        }
      }

      if (!!response.data[0] && response.data[0].date_created) {
        let strippedDateCreated = response.data[0].date_created
          .replace(/T/g, ' ')
          .replace(/Z/g, '');
        strippedDateCreated = strippedDateCreated.substring(
          0,
          strippedDateCreated.indexOf('.'),
        );
        let strippedDateModified = response.data[0].date_modified
          .replace(/T/g, ' ')
          .replace(/Z/g, '');
        strippedDateModified = strippedDateModified.substring(
          0,
          strippedDateModified.indexOf('.'),
        );
        getChildBpages(response.data[0]);
        setDateModified(strippedDateModified);
        setDateCreated(strippedDateCreated);
        setValue(unescape(response.data[0].message));
        setIsPrivateBpage(response.data[0].private);
        setDataCurrentBpage(response);
        const togglePrivateMode = () => {
          if (response.data[0].private) {
            setTimeout(() => {
              setVerificationMessage('In Private Mode!');
            }, 2000);
            setValue(unescape(response.data[0].message));
            setPrivateText('Private Mode Is On');
          } else if (!response.data[0].private) {
            setValue(unescape(response.data[0].message));
            setPrivateText('Private Mode Is Off');
          }
        };
        togglePrivateMode();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const decodeHtml = html => {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const updateBpageAndVerification = async passedUpdateData => {
    collectIdAndOrPostEachBranch(passedUpdateData, true, props.baseURL,props.match.params);

    setVerificationMessage('Message was saved.');
    setValue(unescape(value));
    setTimeout(() => {
      setVerificationMessage('');
    }, 2000);
  };

  const formatDate = () => {
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const handleSubmit = e => {
    let passedUpdateData = value;
    if (passedUpdateData) {
      //sql statements seem to error unless we replace these characters before making a query.
      passedUpdateData = encodeURIComponent(passedUpdateData);
      passedUpdateData = passedUpdateData
        .replace(/;/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

      const updateBpage = async passedUpdateData => {
        try {
          if (Authenticated) {
            if (!!value) {
              updateBpageAndVerification(passedUpdateData);
            }
          }
        } catch (error) {
          setVerificationMessage('Some kind of error occured:' + error);
          setValue(unescape(value));
          console.error(error);
        }
      };

      updateBpage(passedUpdateData);

      setDateCreated(formatDate());
    }
    e.preventDefault();
  };

  const handleDelete = () => {
    if (!!childBpages.length) {
      alert("Can't delete this bpage. It has children.");
      return;
    }
    if (
      window.confirm(
        'Are you sure you want to delete this record from the database?',
      )
    ) {
      if (window.confirm('Really delete?')) {
        const deleteBpage = async () => {
          try {
            const currBpageId = await collectIdAndOrPostEachBranch('');
            await axios.delete(`${props.baseURL}/api/bpages/${currBpageId}`);
            setVerificationMessage('Bpage Deleted');
            setTimeout(() => {
              window.location.replace('/');
            }, 2000);
          } catch (error) {
            setVerificationMessage(
              'An error happened in deleting the bpage!!!!',
            );
            console.log(error);
          }
        };
        deleteBpage();
      }
    }
  };

  const handlePrivate = () => {
    if (Authenticated) {
      if (isPrivateBpage) {
        setIsPrivateBpage(0);
        setPrivateText('Private Mode Is Off');
        const postPrivateOff = () => {
          axios
            .post(
              `${props.baseURL}/api/bpages/private/${props.match.params.id}`,
              {isPrivateBpage: 0},
            )
            .catch(function (error) {
              return JSON.stringify(error);
            });
        };
        postPrivateOff();
      } else if (!isPrivateBpage) {
        setIsPrivateBpage(1);
        setPrivateText('Private Mode Is On');
        const postPrivateOn = () => {
          axios
            .post(
              `${props.baseURL}/api/bpages/private/${props.match.params.id}`,
              {isPrivateBpage: 1},
            )
            .catch(function (error) {
              return JSON.stringify(error);
            });
        };
        postPrivateOn();
      }

      props.setPinBpages([]);
      props.getPinBpages();
    }
  };

  const toTitleCase = str => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  var hidden = {
    display: !Authenticated ? 'none' : 'inline-block',
  };

  const moveBpage = async () => {
    var destination = prompt(
      'Enter path to move bpage to',
      'my/example/bpage/b',
    );

    if (destination === null || destination === '') {
      alert('You did not enter the bpage field.');
    } else {
      destination = destination.split('/').filter(function (el) {
        return el.length !== 0;
      });
      const bpageExistence = await checkIfBpageExists(
        destination,
        props.baseURL,
      );
      if (!bpageExistence) {
        const oldPid = await collectIdAndOrPostEachBranch('');
        collectIdAndOrPostEachBranch('', true, true, oldPid, destination);
        const printDestination = destination.toString().replaceAll(',', '/');
        setVerificationMessage(
          'Bpage successfully moved to: ' + printDestination,
        );
      } else {
        alert(
          'Sorry a bpage already exists in that destination! Please, try a different destination',
        );
      }
    }
  };

  const setPinBpage = async () => {
    if (dataCurrentBpage.data[0]) {
      await axios.post(
        `${props.baseURL}/api/bpages/setpin/${dataCurrentBpage.data[0].namepid}`,
      );
      setPinnedBpage(!pinnedBpage);
    } else {
      alert('cant get current bpage');
    }

    //refresh side bar
    props.setPinBpages([]);
    props.getPinBpages();
  };

  const getPinBpage = async id => {
    const res = await axios.get(
      `${props.baseURL}/api/bpages/getPinBpage/${id}`,
    );
    return res.data[0].pin;
  };

  return (
    <div className="bpages">
      <IndivinstMoneyButton message={value} />
      <Link
        className="pure-button backToParent"
        to={props.match.url.substring(
          0,
          props.match.url.replace(/\/+$/, '').lastIndexOf('/'),
        )}>
        <span>&#8249;</span> Back to{' '}
        {!!props.match.url.replace(/\/+$/, '').split('/')[
          props.match.url.replace(/\/+$/, '').split('/').length - 2
        ]
          ? props.match.url.replace(/\/+$/, '').split('/')[
              props.match.url.replace(/\/+$/, '').split('/').length - 2
            ]
          : 'Homepage'}
      </Link>
      <div
        className={`header ${
          isPrivateBpage && Authenticated && 'pure-button-primary'
        }`}>
        <h1>{toTitleCase(props.match.params.id)}</h1>
        <br />
        {(!isPrivateBpage || Authenticated) && (
          <ul className="subbpages-list">
            {childBpages.map((e, i) => {
              return (
                <li key={i}>
                  <Link to={props.match.params.id + '/' + e} key={i}>
                    {e}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <br />

      <div className="bpageContent">
        <div className={`leftSide ${!Authenticated ? 'makeCenter' : ''}`}>
          {(!isPrivateBpage || Authenticated) && (
            <div dangerouslySetInnerHTML={{__html: unescape(value)}} />
          )}
          <p>
            Date Modified: {isPrivateBpage && Authenticated ? dateModified : 0}
          </p>
          <p>
            Date Created: {isPrivateBpage && Authenticated ? dateCreated : 0}
          </p>
        </div>
        {Authenticated && (
          <div className="rightSide">
            <div className="topRow">
              <p className="verificationMessage">{verificationMessage} </p>
              <br />
              <button
                style={hidden}
                className={`pure-button pure-button-primary private-button ${
                  !!isPrivateBpage && 'toggleRed-button'
                }`}
                onClick={handlePrivate}>
                {privateText}
              </button>
              {!!dateCreated && (
                <button
                  className="pure-button pure-button-primary bar-button"
                  onClick={moveBpage}>
                  Move / Rename
                </button>
              )}
              {!!dateModified && (
                <button
                  className={`pure-button pure-button-primary bar-button ${
                    !!pinnedBpage && 'toggleRed-button'
                  }`}
                  onClick={setPinBpage}>
                  {!!pinnedBpage ? 'UnPin' : 'Pin'}
                </button>
              )}
            </div>
            <div
              style={hidden}
              className="pure-form pure-form-aligned createBpage">
              <fieldset>
                <div className="pure-control-group">
                  <div className="pure-control-group">
                    <textarea
                      onChange={event => setValue(unescape(event.target.value))}
                      onKeyPress={event => handleKeyPress(event)}
                      id="message_textarea"
                      type="text"
                      value={decodeHtml(value)}
                      placeholder="Create"
                      ref={textAreaRef}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="pure-button pure-button-primary messageSubmit-button">
                  Submit
                </button>
                <button
                  className="pure-button pure-button-primary deleteBpage-button"
                  onClick={handleDelete}>
                  Delete
                </button>
                <p className="verificationMessage">{verificationMessage} </p>
              </fieldset>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bpages;
