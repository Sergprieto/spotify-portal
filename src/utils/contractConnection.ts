import * as waveArtifacts from './WavePortal.json'
import { ethers, Contract } from 'ethers'

export interface WaveMessage {
  address: string
  timestamp: Date
  message: string
}

const contractAddress: any = '0xc87974C4e3C86b0b2D1d15c2DB7d8c097ba34Eb4'
const contractABI = waveArtifacts.abi

export const connectWallet = async (): Promise<string> => {
  const { ethereum }: any = window
  if (!ethereum) {
    console.log('Get metamask first to connect a wallet')
    return ''
  }

  const accounts: string[] = await ethereum.request({
    method: 'eth_requestAccounts'
  })
  console.log('Connected', accounts[0])
  return accounts[0]
}

const getPortalContract = async (): Promise<Contract> => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum)
  const signer = provider.getSigner()
  return new ethers.Contract(contractAddress, contractABI, signer)
}

export const wave = async (message: string) => {
  const wavePortalContract = await getPortalContract()

  let count = await wavePortalContract.getTotalWaves()
  console.log('Retrieved total wave count...', count.toNumber())

  const waveTxn: any = await wavePortalContract.wave(message, {
    gasLimit: 300000
  })
  console.log('Mining...', waveTxn.hash)
  await waveTxn.wait()
  console.log('Mined -- ', waveTxn.hash)

  count = await wavePortalContract.getTotalWaves()
  console.log('Retrieved total wave count', count.toNumber())
}

export const getAllWaves = async (): Promise<WaveMessage[]> => {
  const wavePortalContract = await getPortalContract()

  let waves: any[] = await wavePortalContract.getAllWaves()

  const wavesCleaned: WaveMessage[] = []

  waves.forEach(wave => {
    wavesCleaned.push({
      address: wave.waver,
      timestamp: new Date(wave.timestamp * 1000),
      message: wave.message
    })
  })

  await listenToWavePortal()

  return wavesCleaned
}

const listenToWavePortal = async () => {
  const wavePortalContract = await getPortalContract()

  wavePortalContract.on('winnerWinner', (from, time) => {
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
