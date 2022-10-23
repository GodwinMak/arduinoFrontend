import React, {useState} from 'react'
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";
import "./login.css"
import axios from 'axios'
import { loginRoute } from "../utills/APIRoute"
import Avatar from '../assets/images/Avatar.png'


const Login = () => {

    const navigate = useNavigate();
    const toastOptions = {
        position: 'bottom-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    }

    const [values, setValues] = useState({
        username: "",
        password: "",
    })

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });

    }
    const handleValidation = () => {
        const { password, username, } = values;
        if (password === "") {
            toast.error("Registration number and password is required", toastOptions)
            return false;
        } else if (username.length === "") {
            toast.error(
                "Registration number and password is required", toastOptions
            );
            return false;
        }
        return true
    }

    const handleLogin = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            const { username, password } = values;
            const { data } = await axios.post(loginRoute, {
                username,
                password
            });
            if (data.status === false) {
                toast.error(data.msg, toastOptions)
            }
            if (data.status === true) {
                localStorage.setItem('map-user', JSON.stringify(data.user))
                navigate("/dashboard");
            }
        };

    }

  return (
    <div className= "form__container">
        <div className="loginbox">
            <img src={Avatar} alt='' className='avatar'/>
            <h1 className='title'>Login here</h1>
            <form onSubmit={(event) => handleLogin(event)}>
                <div>
                    <p>User Name</p>
                    <input 
                        type='text'
                        name='username'
                        placeholder='Enter user name'
                        onChange={(event) => handleChange(event)}
                    />
                </div>
                <div>
                    <p>Password</p>
                    <input
                        type='password'
                        name='password'
                        placeholder='Enter password'
                        onChange={(event) => handleChange(event)}
                    />
                </div>
                <div>
                    <input type='submit' value='Login'/>
                </div>
                  <div>
                      <p className="">
                          Don't have an account ? <Link to="/sign">Sign In</Link>
                      </p>
                  </div>
            </form>
        </div>
        <ToastContainer/>
    </div>
    )
}

export default Login