import React, { useState } from 'react';
import '../css/board.css'; // Ensure this path is correct based on your file structure
import logo from '../assets/logo.png';
import homeIcon from '../assets/home-.png'; // Ensure consistency in naming convention, e.g., `home-.png` to `home.png`
import moneyIcon from '../assets/money.png';
import eventIcon from '../assets/gestion.png'; // Consider renaming for clarity, e.g., `event.png`
import messageIcon from '../assets/messages.png';
import documentIcon from '../assets/doc.png';
import searchIcon from '../assets/loop.png';
import chatIcon from '../assets/chat_.png'; // Ensure file name consistency, `chat_.png` to `chat.png`
import notifIcon from '../assets/notif.png';
import boardIcon from '../assets/fatrows.png';
import listIcon from '../assets/calendar-light.png'; // Ensure this is the correct icon for 'list'

const Dashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: homeIcon, link: 'accueil-admin.php' },
    { name: 'Finance', icon: moneyIcon, link: '#' },
    { name: 'Événements', icon: eventIcon, link: 'event.php' }, // Use HTML entity for special characters
    { name: 'Messagerie', icon: messageIcon, link: '#' },
    { name: 'Documents', icon: documentIcon, link: '#' },
  ];

  return (
    <div id="body">
      <nav className="nav-max">
        <header>
          <img src={logo} alt="Company Logo" className="logo" yle={{ display: 'block', margin: '0 auto' }} height="80"/>
        </header>
        <ul className="menu">
          <li className="menu_title">
          <strong><span style={{ marginLeft: '25px' }}>MENU</span></strong>
          </li>
          {menuItems.map(item => (
            <li key={item.name} className={`menuItem ${activeMenuItem === item.name ? 'highlighted' : ''}`} onClick={() => setActiveMenuItem(item.name)}>
              <a className="nav-link" href={item.link}>
                <img className="icon" src={item.icon} alt={`${item.name} Icon`} />
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <section id="horiz">
        {/* Consider extracting this into a separate component if more icons will be added for scalability */}
        <div className="nav_img">
          <img src={boardIcon} alt="Board Icon" />
          <a className="nav-link" href="accueil-admin.php">Board</a>
        </div>
        <div className="nav_img">
          <img src={listIcon} alt="List Icon" />
          <a className="nav-link" href="list.php">List</a>
        </div>
        <div className="nav_img">
          <img src={listIcon} alt="List Icon" />
          <a className="nav-link" href="list.php">List</a>
        </div>
        <div className="nav_img">
          <img src={listIcon} alt="List Icon" />
          <a className="nav-link" href="list.php">List</a>
        </div>
        {/* Ensure the asset path consistency */}
        <div className="search-container">
          <img src={searchIcon} alt="Search Icon" height="20px" />
          <input type="text" placeholder="Search..." className="search_input" />
        </div>
        <div  id="right1">
          <img src={chatIcon} height="20px" alt="Chat Icon" />
        </div>
        <div id="right2">
          <img src={notifIcon} height="20px" alt="Notifications Icon" />
        </div>
        <div className="circle">
          <a href="profil_admin.php"><img src={boardIcon}/></a>
          </div>
    </section>
      <section className="content">
        <div className="main_table">
          <h3>Dernières notifications</h3>
          {/* Content goes here */}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
