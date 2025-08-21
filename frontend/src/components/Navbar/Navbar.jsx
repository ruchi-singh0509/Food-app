import React, { useContext, useState, useRef, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setLogin }) => {
    const [menu, setMenu] = useState("menu");
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    const navigate = useNavigate();
    const profileRef = useRef(null);
    
    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    }
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileRef]);
    
    // Handle keyboard navigation
    const handleKeyDown = (e, action) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    }

    return (
        <nav className='navbar' role="navigation" aria-label="Main navigation">
            <Link to='/' aria-label="Home page">
                <img src={assets.logo} alt="Food App Logo" className='logo' />
            </Link>
            
            <ul className="navbar-menu" role="menubar" aria-label="Main menu">
                <li role="none">
                    <Link 
                        to='/' 
                        onClick={() => setMenu("home")} 
                        className={menu === "home" ? "active" : ""}
                        role="menuitem"
                        aria-current={menu === "home" ? "page" : undefined}
                    >
                        Home
                    </Link>
                </li>
                <li role="none">
                    <a 
                        href='#menu' 
                        onClick={() => setMenu("menu")} 
                        className={menu === "menu" ? "active" : ""}
                        role="menuitem"
                        aria-current={menu === "menu" ? "page" : undefined}
                    >
                        Menu
                    </a>
                </li>
                <li role="none">
                    <a 
                        href='#app' 
                        onClick={() => setMenu("mobile")} 
                        className={menu === "mobile" ? "active" : ""}
                        role="menuitem"
                        aria-current={menu === "mobile" ? "page" : undefined}
                    >
                        Mobile-app
                    </a>
                </li>
                <li role="none">
                    <a 
                        href='#footer' 
                        onClick={() => setMenu("contact")} 
                        className={menu === "contact" ? "active" : ""}
                        role="menuitem"
                        aria-current={menu === "contact" ? "page" : undefined}
                    >
                        Contact us
                    </a>
                </li>
            </ul>
            
            <div className="navbar-right">
                <button 
                    className="search-button" 
                    aria-label="Search"
                    onClick={() => alert('Search functionality coming soon!')}
                >
                    <img src={assets.search_icon} alt="" />
                </button>
                
                <div className="navbar-search-icon">
                    <Link 
                        to='/cart' 
                        aria-label={`Shopping cart${getTotalCartAmount() > 0 ? ' with items' : ', empty'}`}
                    >
                        <img src={assets.basket_icon} alt="" />
                        {getTotalCartAmount() > 0 && (
                            <div 
                                className="dot" 
                                aria-hidden="true"
                            ></div>
                        )}
                    </Link>
                </div>
                
                {!token ? (
                    <button 
                        onClick={() => setLogin(true)}
                        aria-label="Sign in"
                    >
                        Sign in
                    </button>
                ) : (
                    <div 
                        className='navbar-profile' 
                        ref={profileRef}
                        aria-expanded={profileDropdownOpen}
                        aria-haspopup="true"
                    >
                        <button 
                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                            onKeyDown={(e) => handleKeyDown(e, () => setProfileDropdownOpen(!profileDropdownOpen))}
                            aria-label="Profile menu"
                            aria-controls="profile-dropdown"
                        >
                            <img src={assets.profile_icon} alt="Profile" />
                        </button>
                        
                        <ul 
                            id="profile-dropdown"
                            className={`nav-profile-dropdown ${profileDropdownOpen ? 'visible' : ''}`}
                            role="menu"
                            aria-label="Profile options"
                        >
                            <li role="none">
                                <button 
                                    onClick={() => navigate('/myorders')}
                                    onKeyDown={(e) => handleKeyDown(e, () => navigate('/myorders'))}
                                    role="menuitem"
                                    tabIndex={profileDropdownOpen ? 0 : -1}
                                >
                                    <img src={assets.bag_icon} alt="" />
                                    <span>Orders</span>
                                </button>
                            </li>
                            <hr aria-hidden="true" />
                            <li role="none">
                                <button 
                                    onClick={logout}
                                    onKeyDown={(e) => handleKeyDown(e, logout)}
                                    role="menuitem"
                                    tabIndex={profileDropdownOpen ? 0 : -1}
                                >
                                    <img src={assets.logout_icon} alt="" />
                                    <span>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar