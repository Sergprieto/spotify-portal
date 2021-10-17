import hre from 'hardhat'

const main = async () => {
  const SpotifyContractFactory = await hre.ethers.getContractFactory(
    'SpotifyPortal'
  )
  const spotifyContract = await SpotifyContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1')
  })
  await spotifyContract.deployed()
  console.log('Contract address is:', spotifyContract.address)

  let contractBalance = await hre.ethers.provider.getBalance(
    spotifyContract.address
  )
  console.log(
    'Contract Balance:',
    hre.ethers.utils.formatEther(contractBalance)
  )

  let songTxn = await spotifyContract.addSong('Bob Dole', 'Test URL')
  await songTxn.wait()

  contractBalance = await hre.ethers.provider.getBalance(
    spotifyContract.address
  )
  console.log(
    'Contract Balance:',
    hre.ethers.utils.formatEther(contractBalance)
  )
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
