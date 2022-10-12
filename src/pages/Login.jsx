import React, {useState} from 'react'
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";
import "./login.css"
import {Button} from "react-bootstrap"
import axios from 'axios'
import { loginRoute } from "../utills/APIRoute"


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
        <div className='form__container__card'>
              <form onSubmit={(event) => handleLogin(event)} className='form__container__card-form'>
                <div>
                    <label htmlFor='username'>User Name</label>
                    <input
                        className='input-box'
                        type='text'
                        name='username'
                        placeholder='username'
                        onChange={(event) => handleChange(event)}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        className='input-box'
                        type='password'
                        name='password'
                        placeholder='Password'
                        onChange={(event) => handleChange(event)}
                    />
                </div>
                <Button variant="success" type="submit">Login</Button>
                <div>
                    <p className="">
                        Don't have an account ? <Link to="/sign">Signup</Link>
                    </p>
                </div>
            </form>
        </div>
          
    <ToastContainer/>
    </div>
    )
}

export default Login