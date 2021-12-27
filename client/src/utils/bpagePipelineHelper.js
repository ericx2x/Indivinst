import axios from 'axios';

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


export const collectIdAndOrPostEachBranch = async (
    passedUpdateData,
    postBool,
    baseURL,
    params,
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
        `${baseURL}/api/bpages/update/${params.id}/${
          paths.length > 1 ? pid : 0
        }`,
        {messageData: passedUpdateData},
      );
    }

    return previousBpage.data[0] ? previousBpage.data[0].id : 0;
  };

