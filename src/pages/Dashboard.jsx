import React, { useEffect, useContext} from 'react'
import './dashboard.css'
import { Outlet, useNavigate } from 'react-router-dom'
import { AppContext } from '../components/context/appContext';
import Header from '../components/adminLTE/Header';
import Footer from '../components/adminLTE/Footer';
import SideNav from '../components/adminLTE/SideNav';


const Dashboard = () => {
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
      <SideNav />
      <Footer />
      </>
  )
}

export default Dashboard