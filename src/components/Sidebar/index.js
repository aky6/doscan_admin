import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

const Sidebar = () => {
  const [toggle, setToggle] = useState('sidebar');
  return (
    <div className='homesidebar'>
      <div className='btn' onClick={() => setToggle(!toggle)}>
        <span className='fas fa-bars'></span>
      </div>
      <nav className={toggle ? 'sidebar' : 'show'}>
        {/* <div className='text'>Side Menu</div> */}
        <ul>
          <li className='active'>
            <Link to='/'>Dashboard</Link>
          </li>
          <li>
            <Link to='/' className='feat-btn'>
              Map
              <span className='fas fa-caret-down first'></span>
            </Link>
            <ul className='feat-show'>
              <li>
                <Link to='/'>Pages</Link>
              </li>
              <li>
                <Link to='/'>Elements</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to='/' className='serv-btn'>
              Services
              <span className='fas fa-caret-down second'></span>
            </Link>
            <ul className='serv-show'>
              <li>
                <Link to='/'>App Design</Link>
              </li>
              <li>
                <Link to='/'>Web Design</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to='/'>Portfolio</Link>
          </li>
          
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
