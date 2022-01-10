import axios from 'axios';
axios.defaults.withCredentials = true;

export const retrievePaths = async (name, namepid, baseURL) => {
  const paths = [];
  let namepidArr = namepid.split(' ');

  //goes thru the sidebar link and retrieves the path of that link by doing namepid lookups
  while (namepidArr) {
    paths.unshift(namepidArr[0]);
    const theBpage = await axios.get(
      `${baseURL}/api/bpages/retreivePathing/${namepidArr[1]}`,
    );
    namepidArr = theBpage.data[0] ? theBpage.data[0].namepid.split(' ') : '';
  }

  return {name: name, url: paths.toString().replaceAll(',', '/')};
};

export const checkIfBpageExists = async (destination, baseURL) => {
  let pid = 0;
  for (let i = 0; i < destination.length; i++) {
    const response = await axios.get(
      `${baseURL}/api/bpages/namepid/${destination[i]}/${pid}`,
    );
    !!response.data[0] && (pid = response.data[0].id);
    if (
      i === destination.length - 1 &&
      response.data[0] &&
      response.data[0].message
    ) {
      return true;
    }
  }
  return false;
};

//This function runs thru the branches or url path and creates a post request for each branch/page that was entered (thus also creating the page itself for each branch). This function should also return the ID of the specified branch
export const collectIdAndOrPostEachBranch = async (
  passedUpdateData,//the value of the message
  postBool,
  baseURL,
  params,
  txid,//txid of the bpage
  //updateCurrBpageId,
  //idNumber,
  //moveDirectory,
) => {
  let paths = Object.values(params);
  //if (moveDirectory) {
  //paths = moveDirectory;
  //}

  let pid = 0;
  let previousBpage;

  for (let i = 0; i < paths.length; i++) {
    if (i === 0) {
      if (postBool) {
        await axios.post(`${baseURL}/api/bpages/${paths[i]}`, {
          messageData: passedUpdateData,
          txid: txid,
          pid: 0,
        });
      }
      previousBpage = await axios.get(
        `${baseURL}/api/bpages/namepid/${paths[i]}/${pid}`,
      );
    } else {
      pid = previousBpage.data[0].id;

      if (postBool) {
        await axios.post(`${baseURL}/api/bpages/${paths[i]}`, {
          messageData: passedUpdateData,
          txid: txid,
          pid: pid,
        });
      }

      previousBpage = await axios.get(
        `${baseURL}/api/bpages/namepid/${paths[i]}/${pid}`,
      );
    }
  }

  //if (updateCurrBpageId) {
  //await axios.delete(
  //`${baseURL}/api/bpages/${previousBpage.data[0].id}`,
  //);
  //await axios.post(
  //`${baseURL}/api/bpages/updatePid/${paths[paths.length - 1]}/${
  //paths.length > 1 ? pid : 0
  //}/${idNumber}`,
  //{messageData: value},
  //);
  //}

  if (postBool) {
    //This will only fire on a normal creation of a bpage and nothing to do with moving or renaming
    await axios.post(
      `${baseURL}/api/bpages/update/${params.id}/${paths.length > 1 ? pid : 0}`,
      {messageData: passedUpdateData, txid: txid},
    );
  }

  return previousBpage.data[0] ? previousBpage.data[0].id : 0;
};

//moves bpage
export const moveBpage = async (baseURL, params) => {
  var destination = prompt('Enter path to move bpage to', 'my/example/bpage/b');

  if (destination === null || destination === '') {
    alert('You did not enter the bpage field.');
  } else {
    destination = destination.split('/').filter(function (el) {
      return el.length !== 0;
    });
    const bpageExistence = await checkIfBpageExists(destination, baseURL);
    if (!bpageExistence) {
      const oldPid = await collectIdAndOrPostEachBranch('', false, '', params);
      collectIdAndOrPostEachBranch('', true, true, oldPid, destination);
      const printDestination = destination.toString().replaceAll(',', '/');
      return 'Bpage successfully moved to: ' + printDestination;
    } else {
      return 'Sorry a bpage already exists in that destination! Please, try a different destination';
    }
  }
};

//returns an object of needed data from a depth of bpages?
export const getBpageData = async (baseURL, params) => {
  let response;
  try {
    const paths = Object.values(params);
    let pid;
    for (let i = 0; i < paths.length; i++) {
      if (i === 0) {
        pid = 0;
        response = await axios.get(
          `${baseURL}/api/bpages/namepid/${paths[i]}/${pid}`,
        );
        !!response.data[0] && (pid = response.data[0].id);
      } else {
        response = await axios.get(
          `${baseURL}/api/bpages/namepid/${paths[i]}/${pid}`,
        );
        !!response.data[0] && (pid = response.data[0].id);
      }
    }
    return response;
  } catch (error) {
    console.error(error);
    return response;
  } finally {
    return response;
  }
};
