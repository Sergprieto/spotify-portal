import * as spotifyArtifacts from './SpotifyPortal.json'
import { ethers, Contract } from 'ethers'

export interface SongContract {
  address: string
  timestamp: Date
  url: string
  submittedby: string
}

const contractAddress: any = '0xB52D54d625d74608893f5F894480cDeD456fccb1'
const contractABI = spotifyArtifacts.abi

export const connectWallet = async (): Promise<string> => {
  const { ethereum }: any = window
  if (!ethereum) {
    alert('Download the metamask extension to send a song through the blockchain!')
    return ''
  }

  const accounts: string[] = await ethereum.request({
    method: 'eth_requestAccounts'
  })
  console.log('Connected', accounts[0])
  return accounts[0]
}

const getSignedContract = async (): Promise<Contract> => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum)
  const signer = provider.getSigner()
  return new ethers.Contract(contractAddress, contractABI, signer)
}

const getUnsignedContract = async (): Promise<ethers.Contract> => {
  const alchemyProvider = new ethers.providers.AlchemyProvider('rinkeby')
  return new ethers.Contract(contractAddress, spotifyArtifacts.abi, alchemyProvider)
}

export const addSong = async (url: string, submittedBy: string) => {
  const spotifyContract = await getSignedContract()

  let count = await spotifyContract.getTotalSongs()
  console.log('Retrieved total song count...', count.toNumber())

  const messageTransaction: any = await spotifyContract.addSong(
    submittedBy,
    formatURL(url),
    {
      gasLimit: 300000
    }
  )
  console.log('Mining...', messageTransaction.hash)
  await messageTransaction.wait()
  console.log('Mined -- ', messageTransaction.hash)

  count = await spotifyContract.getTotalSongs()
  console.log('Retrieved total song count', count.toNumber())
}

const formatURL = (url: string): string => {
  if (url.indexOf('embed') === -1) {
    const embed = '/embed/'
    const comIndex = url.indexOf('.com')
    
    const insertIndex = url.indexOf('/', comIndex)
    url = url.slice(0, insertIndex) + embed + url.slice(insertIndex+1)
  }

  const queryIndex = url.indexOf('?')
  if (queryIndex < 0) return url

  return url.slice(0, queryIndex)
}

export const getAllSongs = async (): Promise<SongContract[]> => {
  
  const spotifyContract = await getUnsignedContract()
  const songs: any[] = await spotifyContract.getAllSongs()

  const formatedSongs: SongContract[] = []

  songs.forEach(song => {
    formatedSongs.push({
      address: song.addr,
      timestamp: new Date(song.timestamp * 1000),
      url: formatURL(song.url),
      submittedby: song.submittedBy
    })
  })

  return formatedSongs
}

export const listenToUpdates = async (setAllSongs: Function) => {
  const spotifyContract = await getUnsignedContract()
  spotifyContract.on('newSong', (from, timestamp, submittedBy, url) => {
    const newestSong: SongContract = {
      address: from,
      timestamp: new Date(timestamp * 1000),
      url: formatURL(url),
      submittedby: submittedBy
    }
    setAllSongs((oldSongList: SongContract[]) => [...oldSongList, newestSong])
  })
}
