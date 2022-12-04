import React from 'react'
import { Outlet} from 'react-router-dom'
import Header from '../components/adminLTE/Header';
import Footer from '../components/adminLTE/Footer';
import SideNav from '../components/adminLTE/SideNav';


const Dashboard = () => {
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