import hre from 'hardhat'

const main = async () => {
  const SpotifyContractFactory = await hre.ethers.getContractFactory(
    'SpotifyPortal'
  )
  const spotifyContract = await SpotifyContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.0001')
  })
  await spotifyContract.deployed()
  console.log('Deploying contracts with the account:', spotifyContract.address)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
