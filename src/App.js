import 'regenerator-runtime/runtime';
import React from 'react';
import { login, logout } from './utils';
import './global.css';
import Big from 'big.js';



import getConfig from './config';
const { networkId } = getConfig(process.env.NODE_ENV || 'development');

const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();
const MINT_FEE = '0.01';

export default function App() {
  // use React Hooks to store greeting in component state

  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false);

  // The useEffect hook can be used to fire side-effects during render
  // Learn more: https://reactjs.org/docs/hooks-intro.html
  React.useEffect(
    () => {
      // in this case, we only care to query the contract when signed in
      if (window.walletConnection.isSignedIn()) {
        // window.contract is set by initContract in index.js
        console.log("wallet connected")
      }
    },

    // The second argument to useEffect tells React when to re-run the effect
    // Use an empty array to specify "only run on first render"
    // This works because signing into NEAR Wallet reloads the page
    []
  );

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main >
        <div className="background"></div>
        <h1>$10,000,000.00
          ALIEN ABDUCTION
          INSURANCE</h1>
        <p class="center">"Don't Leave Earth...Without It"
        </p>
        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <button onClick={login}>Get NFT Version</button>
        </p>
        <center><img src="https://i.imgur.com/kAaIVku.jpg" class="center" /></center>

      </main>
    );
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <div style={{ float: 'right', display: 'flex' }}>
        <button className="link" onClick={logout}>
          Sign out
        </button>
      </div>
      <main>
        <div className="background"></div>

        <h1 className="gradient-text center">
          HEY {window.accountId}
        </h1>
        <p className="center">$10,000,000.00
          ALIEN ABDUCTION
          INSURANCE NFT BLOCKCHAIN</p>
        <p className="center">""Don't Leave Earth...Without It""</p>

        <form
          onSubmit={async (event) => {
            event.preventDefault();

            try {
              // make an update call to the smart contract
              await window.contract.nft_mint(
                {
                  receiver_id: window.accountId,
                  token_id: window.accountId,
                  metadata: {
                    title: "Auto Certificate",
                    media: "https://bafybeiem6r4jz6feunlo7n7gccilxlie2yxsn54kclv7hvdzzmbj3qu5ve.ipfs.dweb.link/"
                  }
                },
                BOATLOAD_OF_GAS,
                Big(MINT_FEE).times(10 ** 24).toFixed()
              );
            } catch (e) {
              alert(
                'Something went wrong! ' +
                'Maybe you need to sign out and back in? ' +
                'Check your browser console for more info.'
              );
              throw e;
            } finally {
              // re-enable the form, whether the call succeeded or failed
            }
            // show Notification
            setShowNotification(true);

            // remove Notification again after css animation completes
            // this allows it to be shown again next time the form is submitted
            setTimeout(() => {
              setShowNotification(false);
            }, 11000);
          }}
        >
          <fieldset id="fieldset">
            <label
              htmlFor="greeting"
              style={{
                display: 'block',
                color: 'var(--gray)',
                marginBottom: '0.5em',
                textAlign: 'center'
              }}
            >
              "The "Perfect  Policy for Anyone Who Thinks They Have Everything Covered"

              <br />

            </label>
            <center>
              <button
                className="mint-btn"
                disabled={false}
                style={{ borderRadius: '5px' }}
              >
               GET YOUR NOW
              </button>

            </center>
              <br />
            <center><img src="https://i.imgur.com/kAaIVku.jpg" className="center" /></center>

          </fieldset>
        </form>

      </main>
      {showNotification && <Notification />}
    </>
  );
}

// this component gets rendered by App after the form is submitted
function Notification() {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`;
  return (
    <aside>
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.accountId}`}
      >
        {window.accountId}
      </a>
      {
        ' ' /* React trims whitespace around tags; insert literal space character when needed */
      }
      called method: 'mint_nft' in contract:{' '}
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.contract.contractId}`}
      >
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  );
}