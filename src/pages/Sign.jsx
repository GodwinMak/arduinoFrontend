import React, {useState} from 'react'
import { ToastContainer, toast } from "react-toastify"
import { Link} from "react-router-dom";
import axios from 'axios'
import { signRoute } from '../utills/APIRoute';
import Avatar from '../assets/images/Avatar.png'
import './login.css'


const Sign = () => {
    const [isLoading, setIsLoading] = useState(true);

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    }

    const toastOptionsSuccess ={
        position: "top-center",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    }

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const handleChange = ({currentTarget: input}) => {
        setValues({ ...values, [input.name]: input.value });
    }
    
    const validateEmail = (email)=>{
        return /\S+@\S+\.\S+/.test(email);
    }
    const handleValidation = () => {
        const { password, username, confirmPassword, email } = values;
        if (password === "") {
            toast.error("Password is required", toastOptions)
            return false;
        }else if(password !== confirmPassword){
            toast.error("Passwords do not match", toastOptions)
            return false;
        }
         else if (username.length === "") {
            toast.error(
                "user name is required", toastOptions
            );
            return false;
        }
        else if (email.length === "") {
            toast.error(
                "email name is required", toastOptions
            );
            return false;
        }
        else if(!validateEmail(email)){
            toast.error(
                "email is invalid!"
            );
            return false;
        }
        return true
    }

    const [error, setError]= useState("");
    const [msg, setMsg] = useState("")
    const handleSign = async (event) => {
        event.preventDefault();
        try {
        if (handleValidation()) {
            const { username, password, email} = values;
            setIsLoading(false)
            const { data: res} = await axios.post(signRoute, {
                username,
                email,
                password,
            });
            setMsg(res.message);
            localStorage.setItem("token", res.data);
            // console.log(res.data);
            localStorage.setItem("user", username);
            window.location = "/dashboard"
            
        }
        } catch (error) {
            if(error.response && error.response.status >= 400 && error.response.status <= 500){
                setError(error.response.data.message);
            }
        }
        if(error){
            toast.error(error, toastOptions);
        }
        if(msg){
            toast.success(msg, toastOptionsSuccess);
        }
    }
  return (
      <div className="form__container">
          <div className="loginbox">
              <img src={Avatar} alt='' className='avatar' />
              <h1 className='title'>Sign in here</h1>
              <form onSubmit={(event) => handleSign(event)}>
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
                      <label>Email</label>
                      <input
                          type='email'
                          name='email'
                          value = {values.email}
                          placeholder='Enter Your Email'
                          onChange={ handleChange}
                      />
                  </div>
                  <div>
                      <label>Password</label>
                      <input
                          type='password'
                          name='password'
                          value = {values.password}
                          placeholder='Enter password'
                          onChange={handleChange}
                      />
                  </div>
                  <div>
                      <label>Confrim Password</label>
                      <input
                          type='password'
                          name='confirmPassword'
                          value = {values.confirmPassword}
                          placeholder='Confirm password'
                          onChange={ handleChange}
                      />
                  </div>
                  <div>
                    <input type='submit' value={isLoading ? 'Sign in' : 'Sign in...'} />
                  </div>
                  <div>
                      <p className="">
                          I have an account ? <Link to="/">Login</Link>
                      </p>
                  </div>
              </form>
          </div>
          <ToastContainer />
      </div>
  )
}

export default Sign