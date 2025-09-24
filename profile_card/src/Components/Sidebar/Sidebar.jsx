import React, { useState } from 'react'
import './Sidebar.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SidebarData from './SidebarData';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

const Sidebar = () => {

    const { user } = useSelector((state) => state.user)

    const [isOpen, setIsOpen] = useState(true)
    const [activeSubmenu, setActiveSubmenu] = useState(null)


    const toggleSubmenu = (index) =>{
        setActiveSubmenu((prevIndex) => (prevIndex === index ? null : index));
    }

    const toggleSidebar = () =>{
        setIsOpen(!isOpen)
    }

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
         <div className='sidebar-header'>
            <button className='toggle-btn' onClick={toggleSidebar}>
                {isOpen ? <ArrowBackIcon /> : <ArrowForwardIcon />}
            </button>

            <div className='logo'><h2>{isOpen ? user?.name || "Guest" : ""}</h2></div>
         </div>

         <nav className='nav-menu'>
            <ul>
                {SidebarData?.map((item, index) =>(
                    <li key={index}>
                        <Link to={item.path} onClick={item.subItems ? (e) => {e.preventDefault()
                           toggleSubmenu(index)  
                        } : undefined }>
                            {item.icon}
                            {isOpen ? item.title : ""}
                        </Link>

                        {item.subItems && activeSubmenu === index && isOpen &&(
                            <ul className='submenu'>
                                {item.subItems.map((subItem, subIndex) => (
                                    <li key={subIndex}>
                                        <Link to={subItem.path}>{subItem.icon} {subItem.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
         </nav>
         <div className='cart-button'>
            <Link to='cart'>
                <ShoppingCartIcon />
                {isOpen && <span>Cart</span>}
            </Link>
         </div>

    </div>
  )
}

export default Sidebar