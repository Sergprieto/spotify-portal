import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import styles from './App.module.css'
import * as waveArtifacts from './utils/WavePortal.json'

const App = () => {
  const contractAddress: any = "0xD98C2bcE96827944d741F55BeFd372bc60208d61";
  const contractABI = waveArtifacts.abi;

  const [currAccount, setCurrentAccount] = useState(' ');

  const checkIfWalletIsConnected = () => {
    //First make sure we have access to window.ethereum
    const { ethereum }: any = window;

    if (ethereum) {
      console.log('We have the ethereum object', ethereum);
      //Check if we're authorized to access the user's wallet
      ethereum.request({ method: 'eth_accounts' })
      .then((accounts: any) => {
        // We could have multiple accounts, check for one.
        if(accounts.length !== 0) {
          //Grab the first account we have access to.
          const account = accounts[0];
          console.log('Found an authorized account: ', account)

          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      })
    } else {
      console.log('Make sure you have metamask!');
    }
  }

  const connectWallet = () => {
    const { ethereum }: any = window;
    if (ethereum) {
      ethereum.request({ method: 'eth_requestAccounts' })
      .then((accounts: any) => {
        console.log('Connected', accounts[0]);
        setCurrentAccount(accounts[0]);
      })
      .catch((err: Error) => console.log(err))
    } else {
      alert('Get metamask first to connect a wallet');
    }
  };

  const wave = async () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let count = await waveportalContract.getTotalWaves();
    console.log('Retrieved total wave count...', count.toNumber());

    const waveTxn: any = await waveportalContract.wave()
    console.log('Mining...', waveTxn.hash);
    await waveTxn.wait();
    console.log('Mined -- ', waveTxn.hash);

    count = await waveportalContract.getTotalWaves()
    console.log('Retrieved total wave count', count.toNumber());
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, []);

  const showConnectWallet = currAccount ? '' : (
          <button className={styles.waveButton} onClick={connectWallet}>
            Connect Wallet
          </button>
  );
  
  return (
    <div className={styles.mainContainer}>

      <div className={styles.dataContainer}>
        <div className={styles.header}>
        👋 Hey there!
        </div>

        <div className={styles.bio}>
        I am Sergio and I am in my last semester of my Software Engineering degree! Connect your etherium wallet and 
        link me your favorite spotify music!
        </div>

        <button className={styles.waveButton} onClick={wave}>
          Wave at Me
        </button>

        {showConnectWallet}
      </div>
    </div>
  );
}

export default App;