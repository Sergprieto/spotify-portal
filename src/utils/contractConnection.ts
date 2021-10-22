import * as spotifyArtifacts from './SpotifyPortal.json'
import { ethers, Contract } from 'ethers'

export interface SongContract {
  address: string
  timestamp: Date
  url: string
  submittedby: string
}

const contractAddress: any = '0x6759d847B645dc3D7e9Cf81e63A8F571Bda255e4'
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

export const addSong = async (url: string, submittedby: string) => {
  const spotifyContract = await getSpotifyContract()

  let count = await spotifyContract.getTotalSongs()
  console.log('Retrieved total message count...', count.toNumber())

  const messageTransaction: any = await spotifyContract.addSong(
    submittedby,
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
  const queryIndex = url.indexOf('?')
  if (queryIndex < 0) return url

  return url.slice(0, queryIndex)
}

export const getAllSongs = async (): Promise<SongContract[]> => {
  const spotifyContract = await getSpotifyContract()

  const songs: any[] = await spotifyContract.getAllSongs()
  console.log(songs)

  const formatedSongs: SongContract[] = []

  songs.forEach(song => {
    formatedSongs.push({
      address: song.addr,
      timestamp: new Date(song.timestamp * 1000),
      url: song.url,
      submittedby: song.name
    })
  })

  // await listenToContract()

  return formatedSongs
}

// const listenToContract = async () => {
//   const spotifyContract = await getSpotifyContract()

//   spotifyContract.on('winnerWinner', (from, time) => {
//     console.log('We got a winner!', from, time)
//     const date = new Date(time * 1000)
//     alert(
//       'A winner has been selected! They are: ' +
//         from +
//         ' and they won at ' +
//         date +
//         ' give it up for them!'
//     )
//   })
// }
