import './NftCard.css';
import { Button, Card, CardContent, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
const axios = require('axios');

const NftCard = (props) => {
    let tokenId = props.tokenId;
    let uri = props.uri;
    let accounts = props.accounts;
    let contract = props.contract;

    const [nft, setNft] = useState(undefined);
    const [transferAddress, setTransferAddress] = useState(undefined);

    useEffect(async () => {
      if(uri) {
        let data = await getMetadataFromIpfs(uri);
        setNft(data);
        console.log(data);
      }
    }, [uri]);
  
    const transfer = async () => {
      const transfer = await contract.methods
      .safeTransferFrom(accounts[0], transferAddress,tokenId)
      .send({ from: accounts[0], gas: 500000 });
    }
  
    const getMetadataFromIpfs = async (uri) => {
      try {
        const response = await axios.get(uri);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    }
  
    return (
      
     nft ? 
        <Card className="card-margin" sx={{ minWidth: 275 }}>
          <CardContent>
            <div className="card" >
              <div className="name">
                <p>#{tokenId}</p>
                <p>{nft && nft.name}</p>
              </div>
              <div className="photo" style={{ backgroundImage: `url(${nft && nft.image})` }} >
              </div>
              <div className="text-field-wrapper">
                <TextField
                  className="text-field"
                  label="Address"
                  size="small"
                  value={transferAddress}
                  onChange={(e)=> setTransferAddress(e.target.value)}
                />
              </div>
              <Button variant="contained" onClick={transfer}>Transfer</Button>
            </div>
          </CardContent>
        </Card>     
       : null
    )
  }

export { NftCard }