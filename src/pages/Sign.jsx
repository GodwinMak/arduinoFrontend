import React, {useState} from 'react'
import { ToastContainer, toast } from "react-toastify"
import { Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { signRoute } from '../utills/APIRoute';



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
          <div className='form__container__card'>
              <form onSubmit={(event) => handleSign(event)} className='form__container__card-form'>
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
                      <label htmlFor='email'>Email</label>
                      <input
                          className='input-box'
                          type='email'
                          name='email'
                          placeholder='Email'
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
                  <div>
                      <label htmlFor='confirmPassword'>Password</label>
                      <input
                          className='input-box'
                          type='password'
                          name='confirmPassword'
                          placeholder='Confrim Password'
                          onChange={(event) => handleChange(event)}
                      />
                  </div>
                  <Button variant="success" type="submit">Sign Up</Button>
                  <div>
                      <p className="">
                          Don't have an account ? <Link to="/">Login</Link>
                      </p>
                  </div>
              </form>
          </div>

          <ToastContainer />
      </div>
  )
}

export default Sign