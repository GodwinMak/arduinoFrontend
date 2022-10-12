import React, {useState} from 'react'
import Sidebar from '../components/Sidebar'
import './dashboard.css'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
    const [show, setShow] = useState(false)
  return (
      <div className='main'>
          <Sidebar setShow={setShow} show={show} />
            <div className={show === true ? "maincontent active" : "maincontent"}>
            <Outlet />
          </div>
      </div>
  )
}

export default Dashboard