import * as spotifyArtifacts from './SpotifyPortal.json'
import { ethers, Contract } from 'ethers'

export interface ContractMessage {
  address: string
  timestamp: Date
  message: string
}

const contractAddress: any = '0xc87974C4e3C86b0b2D1d15c2DB7d8c097ba34Eb4'
const contractABI = spotifyArtifacts.abi

export const connectWallet = async (): Promise<string> => {
  const { ethereum }: any = window
  if (!ethereum) {
    alert('Get metamask first to connect a wallet')
    return ''
  }

  const accounts: string[] = await ethereum.request({
    method: 'eth_requestAccounts'
  })
  console.log('Connected', accounts[0])
  return accounts[0]
}

const getSpotifyContract = async (): Promise<Contract> => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum)
  const signer = provider.getSigner()
  return new ethers.Contract(contractAddress, contractABI, signer)
}

export const sendMessage = async (message: string) => {
  const spotifyContract = await getSpotifyContract()

  let count = await spotifyContract.getTotalWaves()
  console.log('Retrieved total message count...', count.toNumber())

  const messageTransaction: any = await spotifyContract.wave(message, {
    gasLimit: 300000
  })
  console.log('Mining...', messageTransaction.hash)
  await messageTransaction.wait()
  console.log('Mined -- ', messageTransaction.hash)

  count = await spotifyContract.getTotalWaves()
  console.log('Retrieved total message count', count.toNumber())
}

export const getAllMessages = async (): Promise<ContractMessage[]> => {
  const spotifyContract = await getSpotifyContract()

  let messages: any[] = await spotifyContract.getAllWaves()

  const parsedMessaged: ContractMessage[] = []

  messages.forEach((message) => {
    parsedMessaged.push({
      address: message.waver,
      timestamp: new Date(message.timestamp * 1000),
      message: message.message
    })
  })

  await listenToContract()

  return parsedMessaged
}

const listenToContract = async () => {
  const spotifyContract = await getSpotifyContract()

  spotifyContract.on('winnerWinner', (from, time) => {
    console.log('We got a winner!', from, time)
    const date = new Date(time * 1000)
    alert(
      'A winner has been selected! They are: ' +
        from +
        ' and they won at ' +
        date +
        ' give it up for them!'
    )
  })
}
