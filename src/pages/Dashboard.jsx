import React, {useState, useEffect, useContext} from 'react'
// import Sidebar from '../components/Sidebar';
import './dashboard.css'
import { Outlet, useNavigate } from 'react-router-dom'
import { AppContext } from '../components/context/appContext';

import Header from '../components/adminLTE/Header';
import Home from '../components/adminLTE/Home';
import Footer from '../components/adminLTE/Footer';
import SideNav from '../components/adminLTE/SideNav';


const Dashboard = () => {
    // const [show, setShow] = useState(false)
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

      <Header />
      <Outlet />
      {/* <Home /> */}
      <SideNav />
      <Footer />
          {/* <Sidebar setShow={setShow} show={show} /> 
            <div className={show === true ? "maincontent active" : "maincontent"}>
            <Outlet />
           </div> */}
     
      </>
  )
}

export default Dashboard