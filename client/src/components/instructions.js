import React from 'react';

const AllBpages = () => {
  return (
    <div className="allbpages">
      <div className="header">
        <h3>Instructions</h3>
        <br />
      </div>
      <div>
        <p>
          The site is currently under a lot of construction but is in a semi
          usable state. In order to use the site you must have some Bitcoin SV
          (BSV) in a moneybutton account.
        </p>
        <p>
          Purchasing BSV is a little tough right now but the easiest way I know
          of is to purchase a USD like coin on coinbase.com, swap that over to
          bittrex, and trade it for BSV. Once you have BSV you can send some to
          your moneybutton account and start using it here to develop new
          webpages. I plan to write more detailed instuctions in the future, but
          for now there's a lot of work that has to be done on this site and
          around the Bitcoin SV community in general.
        </p>
        <p>
          It costs roughly the dust amount (less than a penny typically) to
          create content on this site. Content is stored into your paymail
          account, which for now can be viewed via the list Paymails button on
          the left sidebar.
        </p>
        <p>
          In order to write content, you simply have to type in your moneybutton
          handle into the first path of the URL. From there, assuming you're
          logged in, there should be a textarea where you can start writing
          HTML. Once you're done writing your HTML you simply slide the
          moneybutton to make a public bitcoin transaction. Your transaction id
          is saved and stored.
        </p>
        <p>
          You can extend more pages by simply typing subpaths under your paymail
          handle in the URL. This means that developing a webpage is as easy as
          thinking of your idea, typing the path you want to save it under,
          writing the content, and broadcasting the transaction. The transacion
          is stored in the bitcoin sv blockchain and the data attributed to it
          is stored as part of the op_return property of that transactino. I
          plan to also make commits for each publication of page in the future
          so pages you make can have a history log and users can see how they
          developed. as well as a support section on each page generate from
          paymails.
        </p>
        <p>
          The pin, move, and private buttons are all still under development but
          those should do some interesting things in the future as well.
        </p>
        <p>
          For now, the site is in a basic form so I can handle bugs and the such
          as I develop more advanced features. If you decide to post data to
          test out the site please know that in its current form you may lose
          that data. The transaction id will still exist, however the backend to
          this site is undergoing major changes which could make you lose track
          of your data. Individual Institute itself does not hold anyone's data.
        </p>
        <p>
          That said I hope you enjoy the site. The overall concept of this site
          was meant to be extremely intuative. It could rival our exisitng
          internet as we know it. Imagine most of the net being created on the
          net for small micro transactions.
        </p>
      </div>
    </div>
  );
};

export default AllBpages;
