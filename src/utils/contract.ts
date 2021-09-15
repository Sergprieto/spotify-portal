import { Web3Provider } from "@ethersproject/providers";
import * as waveArtifacts from '../utils/WavePortal.json'
import { ethers } from 'ethers';

export interface WaveMessage {
  address: string,
  timestamp: Date,
  message: string,
}

const contractAddress: any = "0xc87974C4e3C86b0b2D1d15c2DB7d8c097ba34Eb4";
const contractABI = waveArtifacts.abi;

export const checkIfWalletIsConnected = () => {
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

export const connectWallet = () => {
  const { ethereum }: any = window;
  if (ethereum) {
    ethereum.request({ method: 'eth_requestAccounts' })
    .then((accounts: any) => {
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
      getAllWaves();
    })
    .catch((err: Error) => console.log(err))
  } else {
    alert('Get metamask first to connect a wallet');
  }
};

export const wave = async (message: string) => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let count = await waveportalContract.getTotalWaves();
    console.log('Retrieved total wave count...', count.toNumber());

    const waveTxn: any = await waveportalContract.wave(message, { gasLimit: 300000 })
    console.log('Mining...', waveTxn.hash);
    await waveTxn.wait();
    console.log('Mined -- ', waveTxn.hash);

    count = await waveportalContract.getTotalWaves()
    console.log('Retrieved total wave count', count.toNumber());
}
export const getAllWaves = async (): Promise<WaveMessage[]> => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();
  const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

  let waves: any[] = await waveportalContract.getAllWaves();

  let wavesCleaned: WaveMessage[] = [];

  waves.forEach(wave => {
    wavesCleaned.push({
      address: wave.waver,
      timestamp: new Date(wave.timestamp * 1000),
      message: wave.message
    })
  });


  return wavesCleaned;

  // waveportalContract.on("winnerWinner", (from, time) => {
  //   console.log("We got a winner!", from, time)
  //   const date = new Date(time * 1000)
  //   alert("A winner has been selected! They are: " + from + " and they won at " + date + " give it up for them!");
  // })
}
