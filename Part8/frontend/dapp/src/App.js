import './App.css';
import React, { useEffect, useState } from 'react';
import { getWeb3, getEncodeNFT } from './utils.js';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { NftCard } from './components/Card/NftCard';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [encodeNft, setEncodeNFT] = useState(undefined);
  const [tokenBalance, setTokenBalance] = useState(undefined);
  const [nftMetadata, setNftMetadata] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const encodeNft = await getEncodeNFT(web3);
      setWeb3(web3);
      setAccounts(accounts);
      setEncodeNFT(encodeNft);
    };
    init();
  }, []);

  useEffect(async () => {
    if(encodeNft && encodeNft.methods) {
      const balance = await getBalance();
      setTokenBalance(balance);
      await getTokenData(accounts[0]);
    }
  }, [encodeNft, accounts]);

  const getBalance = async () => {
    const balance = await encodeNft.methods
        .balanceOf(accounts[0]).call();

    return balance;
  }

  const getTokenData = async () => {
    const data = await encodeNft.methods
        .getTokenMetadata(accounts[0]).call();

    console.log(data);
    setNftMetadata(data);
  }

  const mintNFT = async () => {
    const mint = await encodeNft.methods
        .mintToken()
        .send({ from: accounts[0], gas: 500000 });

        window.location.reload();
  }

  return (
    <div className="App">
      <header className="App-header">
      <p>Mint</p>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={mintNFT}>Mint NFT</Button>
        </Stack>
        {accounts &&
          <div>
            <p>NFT Balance for Address
              {" " + accounts[0].substring(0, 6) + '...' + accounts[0].substring(accounts[0].length - 4, accounts[0].length)}:
            </p>
            <p className="App-balance">{tokenBalance}</p>
          </div>}
          <div className="App-cards">
          { nftMetadata && nftMetadata.map(function(data, index) {
            return <NftCard tokenId={data.tokenId} key={index} contract={encodeNft} accounts={accounts} uri={data.tokenURI} />
          })}
          </div>

      </header>
    </div>
  );
}

export default App;
