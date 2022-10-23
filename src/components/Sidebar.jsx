import React, {useState} from 'react'
import { AiOutlineMenu } from "react-icons/ai";
import { FaMoneyBillAlt } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai"
import {Menu, MenuItem, ProSidebar, SidebarHeader} from 'react-pro-sidebar'
import "react-pro-sidebar/dist/css/styles.css";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({setShow, show}) => {
    const [collapsed , setCollapsed] = useState(false);
    const navigate = useNavigate();
    // added styles 
    const styles = {
        sideBarHeight: {
            height: "100vh",
            position: "fixed",
            top: "0",
            left: "0",
            overflowX: "hidden"
        },
        menuIcon: {
            float: "right",
            margin: "10px",
        },
    };
    const onClickMenuIcon = () => {
        setCollapsed(!collapsed);
        // event.currentTarget.classList.add('active');
        if (collapsed === true) {
            setShow(false);
        }
        else {
            setShow(true)
        }
    };

    const handleClick = async () => {
        localStorage.removeItem('map-user');
        navigate('/')
    }
  return (
      <ProSidebar style={styles.sideBarHeight} collapsed={collapsed}>
          <SidebarHeader>
              <div style={styles.menuIcon} onClick={onClickMenuIcon}>
                  <AiOutlineMenu />
              </div>
          </SidebarHeader>
          <Menu iconShape="square">
              <MenuItem icon={< FaMoneyBillAlt />}>
                  Animal List
                  <Link to='/dashboard' />
              </MenuItem>
              <MenuItem icon={<AiOutlineLogout />} onClickCapture={handleClick}>
                  Logout
              </MenuItem>
          </Menu>
      </ProSidebar>
  )
}

export default Sidebar