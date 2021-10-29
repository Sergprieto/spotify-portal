import { useState, useEffect } from 'react'
import styles from './App.module.css'
import {
  addSong,
  getAllSongs,
  connectWallet,
  SongContract,
  listenToUpdates
} from '../utils/contractConnection'

const App = () => {
  const [currAccount, setCurrentAccount] = useState('')
  const [draft, setDraft] = useState('')
  const [name, setName] = useState('')
  const [allSongs, setAllSongs] = useState<SongContract[]>([])

  const connectWalletHandler = async () => {
    const walletArr = await connectWallet()
    if (walletArr) {
      setCurrentAccount(walletArr)
    }
  }

  const loadInitSongs = async () => {
    const initialSongs = await getAllSongs()
    setAllSongs(initialSongs)
    
  }

  useEffect(() => {
    document.title = 'Spotify Portal'
    loadInitSongs()
    listenToUpdates(setAllSongs)
  }, [])

  const showConnectForm = currAccount ? (
    <>
      <input
        className={styles.draftArea}
        id='name'
        placeholder='Your Name'
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <textarea
        className={styles.draftArea}
        id='message'
        placeholder='The link to your favorite song on spotify!'
        value={draft}
        onChange={e => setDraft(e.target.value)}
      />
    </>
  ) : (
    <button className={styles.draftButton} onClick={connectWalletHandler}>
      Connect Wallet
    </button>
  )

  //Formats all songs to
  const songList = allSongs.map((song: SongContract, index) => {
    return (
      <div key={index}>
        <div>Name of Submitter: {song.submittedby} </div>
        <div>Address: {song.address}</div>
        <div>Time: {song.timestamp.toUTCString()} </div>
        <iframe title={song.url} src={song.url} width="100%" height="80" allow="encrypted-media"></iframe>
      </div>
    )
  })

  return (
    <div className={styles.mainContainer}>
      <div className={styles.dataContainer}>
        <div className={styles.header}>👋 Hey there!</div>

        <div className={styles.bio}>
          <h1>
            I am Sergio and I am in my last semester of my Software Engineering
            degree! This is my first project involving Web3 and Solidity!
          </h1>
          Link your ethereum wallet and send me your favorite spotify music!
        </div>

        <button className={styles.draftButton} onClick={() => addSong(draft, name)}>
          Send me your favorite Spotify music!
        </button>

        {showConnectForm}

        {songList}
      </div>
    </div>
  )
}

export default App
