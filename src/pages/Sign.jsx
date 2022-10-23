import React, {useState} from 'react'
import { ToastContainer, toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { signRoute } from '../utills/APIRoute';
import Avatar from '../assets/images/Avatar.png'



const Sign = () => {
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
        email: "",
        password: "",
        confirmPassword: ""
    })

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });

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
        return true
    }

    const handleSign = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            const { username, password, email} = values;
            const { data } = await axios.post(signRoute, {
                username,
                email,
                password,
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
      <div className="form__container">
          <div className="loginbox">
              <img src={Avatar} alt='' className='avatar' />
              <h1 className='title'>Sign in here</h1>
              <form onSubmit={(event) => handleSign(event)}>
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
                      <p>Email</p>
                      <input
                          type='email'
                          name='email'
                          placeholder='Enter Your Email'
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
                      <p>Confrim Password</p>
                      <input
                          type='password'
                          name='confirmPassword'
                          placeholder='Confirm password'
                          onChange={(event) => handleChange(event)}
                      />
                  </div>
                  <div>
                      <input type='submit' value='Sign in' />
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