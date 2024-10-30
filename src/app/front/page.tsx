'use client'
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react"
import { ethers, BrowserProvider, Contract, formatUnits } from 'ethers'
import { Button } from "@/components/ui/button"
import contractABI from "../../contract/abi.json" assert { type: "json" };
import contractAddress from "../../contract/address.json" assert { type: "json" };
export default function Front() {
  const router = useRouter()
  const { address, isConnected, caipAddress, status } = useAppKitAccount()
  const [greeting, setGreeting] = useState("");
  const { walletProvider } = useAppKitProvider()

  useEffect(() => {
    console.log("Connected: ", isConnected, address, caipAddress, status)
  },[])

  const getContract = async () => {
    if(!isConnected) {
      console.log('Not connected!');
      return;
    }
    const ethersProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await ethersProvider.getSigner()
    const contract = new ethers.Contract(contractAddress.address, contractABI, signer);
    console.log(contract)
    console.log(signer.address);
    const messageHash = await contract.getMessageHash(signer.address, 1);
    console.log("msg ", messageHash)
    let flatSig = await signer.signMessage(ethers.getBytes(messageHash));
    console.log("sign ", flatSig);
    
    const res = await contract.verify(signer.address, 1, flatSig);
    console.log("verify ", res);
  }


  const getSignature = async () => {
    if(!isConnected) {
      console.log('Not connected!');
      return;
    }
    // const ethersProvider = new BrowserProvider(walletProvider)
    const ethersProvider = new ethers.BrowserProvider(window.ethereum); 
    const signer = await ethersProvider.getSigner()
    console.log(signer);
    console.log(ethersProvider)

    // console.log(signer)
    // Sign the string message
    
    const messageHash = ethers.solidityPackedKeccak256(
      ["uint256", "uint256", "address"],
      [1, 1, address.toString()]
    );
    
    // console.log(messageHash);
    let flatSig = await signer.signMessage(messageHash);
    // console.log("Signature: ", flatSig);
    
    let sig = ethers.Signature.from(flatSig);
    // console.log(sig);
    console.log(ethers.verifyMessage(messageHash, flatSig));
    // `signMessage` in ethers.js expects a Uint8Array, so use `arrayify`
    // const signature = await walletClient.signMessage(ethers.getBytes(messageHash));
    // console.log("Generated signature:", signature);
  }
  
  const saveGreeting = ()=>{
    fetch('/api',{
      method:"POST", 
      //The client can only send strings to the server
      //so we need to change our whole object to a string
      body:JSON.stringify({greeting})
    })
  }
  return (
    <div>
      <input value={greeting} onChange={(e)=>setGreeting(e.target.value)}/>
      <button  onClick={saveGreeting}>send my greeting to the server</button>
      <Button onClick={getContract}>Sign Message</Button>
      <w3m-account-button/>
    </div>
  )
}