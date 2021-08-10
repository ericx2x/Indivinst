import React from 'react';
import {Helmet} from 'react-helmet';

const MetaHead = () => {
  return (
    <Helmet>
      <script
        type="text/javascript"
        src="https://unpkg.com/bsv@0.30.0/bsv.min.js"></script>
    </Helmet>
  );
};

export default MetaHead;
