import { useState, useEffect } from 'react'
import styles from './App.module.css'
import {
  sendMessage,
  getAllMessages,
  connectWallet
} from '../utils/contractConnection'

const App = () => {
  const [currAccount, setCurrentAccount] = useState('')
  const [draft, setDraft] = useState('')
  const [allMessages, setAllMessages] = useState<any[]>([])

  const connectWalletHandler = async () => {
    const walletArr = await connectWallet()
    if (walletArr) {
      setCurrentAccount(walletArr)
      loadInitMessages()
    }
  }

  const loadInitMessages = async () => {
    const initialMessages = await getAllMessages()
    setAllMessages(initialMessages)
  }

  useEffect(() => {
    document.title = "Sergio's Spotify Portal"
  }, [])

  const showConnectForm = currAccount ? (
    <textarea className={styles.draftArea}
      id='message'
      placeholder='Enter a message!'
      value={draft}
      onChange={e => setDraft(e.target.value)}
    />
  ) : (
    <button className={styles.draftButton} onClick={connectWalletHandler}>
      Connect Wallet
    </button>
  )

  //Formats all messages to 
  const messageList = allMessages.map((message, index) => {
    return (
      <div key={index} className={styles.message}>
        <div>Address: {message.address}</div>
        <div>Time: {message.timestamp.toString()} </div>
        <div>Message: {message.message} </div>
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

        <button
          className={styles.draftButton}
          onClick={() => sendMessage(draft)}
        >
          Send me your favorite Spotify music!
        </button>

        {showConnectForm}

        {messageList}
      </div>
    </div>
  )
}

export default App
