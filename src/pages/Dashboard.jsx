import React, {useState, useEffect, useContext} from 'react'
import Sidebar from '../components/Sidebar';
import './dashboard.css'
import { Outlet, useNavigate } from 'react-router-dom'
import { AppContext } from '../components/context/appContext';


const Dashboard = () => {
    const [show, setShow] = useState(false)
  const { setCurrentUser } = useContext(AppContext);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchItem = async () => {
      if (!localStorage.getItem("map-user")) {
        navigate("/")


      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("map-user")))
      }
    }

    fetchItem();
  }, [navigate, setCurrentUser]);
  return (
      <>
          <Sidebar setShow={setShow} show={show} /> 
            <div className={show === true ? "maincontent active" : "maincontent"}>
            <Outlet />
           </div>
     
      </>
  )
}

export default Dashboard