import React, { useEffect, useContext} from 'react'    
import { Link, useNavigate } from "react-router-dom"
import avatar2 from '../../assets/images/avatar2.png'
import { AppContext }from '../context/appContext'
import {AiOutlineLogout} from "react-icons/ai"
const SideNav = () => {
    const { setCurrentUser, currentUser } = useContext(AppContext);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      if (!localStorage.getItem("map-user")) {


      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("map-user")))
      }
    }

    fetchItem();
  }, [ setCurrentUser]);

  const handleClick = async()=>{
    localStorage.removeItem("map-user")
    setCurrentUser(null);
    navigate('/')
  }

  return (
    <div>
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="!#" className="brand-link">
            <span className="brand-text font-weight-light">Animal Tracking</span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
            {/* Sidebar user panel (optional) */}
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
                <img src={avatar2} className="img-circle elevation-2" alt="User" />
            </div>
            <div className="info">
                <a href="!#" className="d-block">{currentUser}</a>
            </div>
            </div>
            {/* Sidebar Menu */}
            <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                {/* Add icons to the links using the .nav-icon class
                with font-awesome or any other icon font library */}
                
                <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                    <i className="nav-icon fas fa-th" />
                    <p>
                    Animal List
                    </p>
                </Link>
                </li>

                <li className="nav-item">
                <Link to="#" className="nav-link" onClickCapture={handleClick}>
                    <AiOutlineLogout className='nav-icon' style={{postion: "absolute", buttom: "0"}}/>
                    <p>
                      Log Out
                    </p>
                </Link>
                </li>
            </ul>
            </nav>
            {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
        </aside>

    </div>
  )
}

export default SideNav