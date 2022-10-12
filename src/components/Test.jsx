import React,{useEffect} from 'react'
import io from "socket.io-client";


const Test = () => {
    const socket = io.connect("http://localhost:5003/api/socket");

    useEffect(() => {
        socket.on("newGps", (data)=>{
        console.log(data);
      })
    }, [socket])
    
  return (
    <div>Test</div>
  )
}

export default Test