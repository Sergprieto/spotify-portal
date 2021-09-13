import * as React from "react";
// import { ethers } from "ethers";
import styles from './App.module.css'

const App = () => {

  const wave = () => {
    
  }
  
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
      </div>
    </div>
  );
}

export default App;