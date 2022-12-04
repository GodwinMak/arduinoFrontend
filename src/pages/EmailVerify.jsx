import React, {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from "axios"
import "./emailverify.css"

const EmailVerify = () => {
    const [validUrl, setValidUrl] = useState(false);
    const param = useParams();

    useEffect(() => {
      const verifyEmailUrl = async ()=>{
        const url = `https://animaltracking.patrickmamsery.works/api/v1/${param.id}/verify/${param.token}`;
            const {data}= await axios.get(url);
            console.log(data)
            setValidUrl(true);
      }
      verifyEmailUrl();
    }, [setValidUrl, param]);
    
  return (
    <>
      {validUrl ? 
        <div className='container'>
            <img src="" alt=""/>
            <h1>Email Verified Successfully</h1>
            <Link to = "/">
                <button className='green_btn'>Login</button>
            </Link>
        </div>
      : 
        <h1>404 Not Found</h1>
      }
    </>
  )
}

export default EmailVerify
