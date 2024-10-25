'use client'
import { useState, useEffect } from "react"
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { useRouter } from 'next/navigation'

export default function Front() {
  const router = useRouter()
  const { address, isConnected, caipAddress, status } = useAppKitAccount()
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    console.log("Connected: ", isConnected, address, caipAddress, status)
  },[])
  
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
      <w3m-button/>
    </div>
  )
}