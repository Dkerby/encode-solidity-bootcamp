import Web3 from 'web3';
import VolcanoToken from './contracts/VolcanoToken.json';

const getWeb3 = () => {
    return new Promise((resolve, reject) => {
      // Wait for loading completion to avoid race conditions with web3 injection timing.
      window.addEventListener("load", async () => {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          try {
            // Request account access if needed
            await window.ethereum.enable();
            // Acccounts now exposed
            resolve(web3);
          } catch (error) {
            reject(error);
          }
        }
        else if (window.web3) {
          const web3 = window.web3;
          console.log("Injected web3 detected.");
          resolve(web3);
        }
        else {
          const provider = new Web3.providers.HttpProvider(
            "http://localhost:9545"
          );
          const web3 = new Web3(provider);
          console.log("No web3 instance injected, using Local web3.");
          resolve(web3);
        }
      });
    });
  };
  
  const getEncodeNFT = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = VolcanoToken.networks[networkId];
    return new web3.eth.Contract(
        VolcanoToken.abi,
      "0x8B72d74e76198fc99253A0F90b041D61AD239085"
    );
  }
  
  export { getWeb3, getEncodeNFT }; 