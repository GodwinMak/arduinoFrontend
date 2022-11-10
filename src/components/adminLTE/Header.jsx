/* eslint-disable jsx-a11y/no-redundant-roles */
import React, {useState} from 'react'

const Header = () => {
  const Clock = () => {
    let time = new Date().toLocaleTimeString();
    const [currentTime, setCurrentTime] = useState(time)

    const updateTime = () => {
      let time = new Date().toLocaleTimeString();
      setCurrentTime(time);
    }
    setInterval(updateTime, 1000);
    return (
      <div>
        <span><strong>{currentTime}</strong></span>
      </div>
    )

  }
  return (
    <div>
        {/* Navbar */}
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {/* Left navbar links */}
        <ul className="navbar-nav">
            <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="!#" role="button"><i className="fas fa-bars" /></a>
            </li>
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
            <li className='nav-item' style={{top: "10px", position: "relative"}}>
              <Clock/>
            </li>

            <li className="nav-item">
            <a className="nav-link" data-widget="fullscreen" href="/dashboard" role="button">
                <i className="fas fa-expand-arrows-alt" />
            </a>
            </li>
        </ul>
        </nav>
        {/* /.navbar */}

    </div>
  )
}

export default Header