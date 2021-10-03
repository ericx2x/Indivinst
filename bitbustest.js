const fs = require('fs')
const fetch = require('node-fetch')
const query = {
  q: {
    find: { "out.s2": "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut", "blk.i": { "$gt": 609000 } },
    sort: { "blk.i": 1 },
    project: { "blk": 1, "tx.h": 1, "out.s4": 1, "out.o1": 1 }
  }
};
fetch("https://txo.bitbus.network/block", {
  method: "post",
  headers: {
    'Content-type': 'application/json; charset=utf-8',
    'token': 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxQ2lTMWFtZ1lFNHVKRDVqOEM4QzMzdWRoa052ZkRBWFRZIiwiaXNzdWVyIjoiZ2VuZXJpYy1iaXRhdXRoIn0.SUhiVis5MlovQ3JmR0sxVnVoc3Y4RDlPRnVVNkxqZk1ad0wwVXZYTW00dzdjNnpjcThaaVFpOWliU08vLy9VZWZ4TXBBSFhhc200bVAyK1pIWXVLS0ZRPQ'
  },
  body: JSON.stringify(query)
})
.then((res) => {
  res.body.pipe(fs.createWriteStream("tx.ndjson"))
})
