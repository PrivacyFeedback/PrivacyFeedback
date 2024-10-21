"use client";

import { useState, useEffect } from "react";


export default function Front() {
  const [value, setValue] = useState("");

  const [retrieved, setRetrieved] = useState("Not retrieved yet!");


  const store = async () => {
    fetch('/api/contract',{
      method:"POST", 
      //The client can only send strings to the server
      //so we need to change our whole object to a string
      body:JSON.stringify({value})
    })
  };

  const retreive = async () => {
    const response = await fetch('/api/contract');
    const data = await response.json();
    setRetrieved(data.balance);
    console.log(data.balance);
  };


  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={store}> Store </button>
      <br></br>
      <button onClick={retreive}> Retrieve </button>
      <br></br>
      <div>{retrieved}</div>
    </div>
  );
}
