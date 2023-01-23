import React, { useState } from 'react'
import { ToastContainer, toast } from "react-toastify"
import { Link } from "react-router-dom";
import axios from 'axios'
import { loginRoute } from '../utills/APIRoute';
import Avatar from '../assets/images/Avatar.png'
import './login.css'



const Login = () => {
    const [isLoading, setIsLoading] = useState(true);
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

    const handleChange = ({ currentTarget: input }) => {
        setValues({ ...values, [input.name]: input.value });
    }

   
    const handleValidation = () => {
        const { password, username } = values;
        if (password === "") {
            toast.error("Password is required", toastOptions)
            return false;
        } 
        else if (username.length === "") {
            toast.error(
                "user name is required", toastOptions
            );
            return false;
        }
        return true
    }

    const [error, setError] = useState("")
    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            if (handleValidation()) {
                const { username, password} = values;
                setIsLoading(false);
                const { data: res } = await axios.post(loginRoute, {
                    username,
                    password,
                });
                localStorage.setItem("token", res.data);
                // console.log(res.data);
                localStorage.setItem("user", username);
                window.location ="/dashboard"
            }
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            }
        }
        if (error) {
            toast.error(error, toastOptions)
        }
    }
    return (
        <div className="form__container">
            <div className="loginbox">
                <img src={Avatar} alt='' className='avatar' />
                <h1 className='title'>Sign in here</h1>
                <form onSubmit={(event) => handleLogin(event)}>
                    <div>
                        <label>User Name</label>
                        <input
                            type='text'
                            name='username'
                            value={values.username}
                            placeholder='Enter user name'
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type='password'
                            name='password'
                            value={values.password}
                            placeholder='Enter password'
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input type='submit' value={isLoading ? 'Login' : 'Login in...'} />
                    </div>
                    <div>
                        <p className="">
                            I Don't have an account ? <Link to="/sign">Sign in</Link>
                        </p>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login