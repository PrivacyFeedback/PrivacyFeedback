'use client'
import { useState } from "react"

export default function Front() {
  const [greeting, setGreeting] = useState("");
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
    </div>
  )
}