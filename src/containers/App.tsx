import { useState, useEffect } from 'react'
import styles from './App.module.css'
import { wave, getAllWaves, connectWallet } from '../utils/contractConnection'

const App = () => {
  const [currAccount, setCurrentAccount] = useState('')
  const [message, setMessage] = useState('')
  const [allWaves, setAllWaves] = useState<any[]>([])

  const connectWalletHandler = async () => {
    const walletArr = await connectWallet()
    if (walletArr) {
      setCurrentAccount(walletArr)
      loadInitWaves()
    }
  }

  const loadInitWaves = async () => {
    const initialWaves = await getAllWaves()
    setAllWaves(initialWaves)
  }

  useEffect(() => {
    document.title = "Sergio's Spotify Portal"
  }, [])

  const showConnectForm = currAccount ? (
    <form>
      <input
        type='text'
        id='message'
        placeholder='Enter a message!'
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </form>
  ) : (
    <button className={styles.waveButton} onClick={connectWalletHandler}>
      Connect Wallet
    </button>
  )

  return (
    <div className={styles.mainContainer}>
      <div className={styles.dataContainer}>
        <div className={styles.header}>👋 Hey there!</div>

        <div className={styles.bio}>
          <h1>
            I am Sergio and I am in my last semester of my Software Engineering
            degree!
          </h1>
          <br />
          For now, all you can do is wave at me and maybe win some sick fake
          ethereum. <br />
          But I do enjoy the messages 🙂
          <br />
          Soon you will be able to connect your etherium wallet and link me your
          favorite spotify music!
        </div>

        <button className={styles.waveButton} onClick={() => wave(message)}>
          Wave at Me
        </button>

        {showConnectForm}

        {allWaves.map((wave, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: 'OldLace',
                marginTop: '16px',
                padding: '8px'
              }}
            >
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()} </div>
              <div>Message: {wave.message} </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
