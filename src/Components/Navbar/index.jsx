import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaChess } from 'react-icons/fa';
import { LuAlignJustify } from 'react-icons/lu';
import './styles.css';

const Navbar = () => {
  const activeStyle = 'underline underline-offset-4';

  const Links = [{ name: 'ChessGame', link: '/' }];
  let User = [
    { name: 'Login', link: '/login' },
    { name: 'Profile', link: '/profile' },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  return (
    <nav
      className={`flex items-center fixed z-30 top-0 w-full min-w-[360px] py-2 px-8 text-sm font-medium bg-white shadow-md ${isMenuOpen}`}
    >
      <div className="lg:hidden justify-between flex items-center w-full lg:w-auto">
        <div className="flex items-center">
          <FaChess
            size={40}
            className="bg-blue-200 p-1 border-2 border-black rounded shadow-lg"
          />
          <NavLink to="/" className="font-semibold text-lg ml-2 select-none">
            LJDR-Chess
          </NavLink>
        </div>

        <div className="flex gap-3 items-center">
          <button className="lg:hidden text-xl" onClick={toggleMenu}>
            <LuAlignJustify />
          </button>
        </div>
      </div>
      <div
        ref={menuRef}
        className={`flex lg:flex lg:justify-between lg:items-center gap-10 fixed lg:static bg-white lg:bg-transparent w-full shadow-md lg:shadow-none ${
          isMenuOpen ? 'menu-open left-0 pl-8' : 'hidden'
        }`}
      >
        <ul className="flex flex-col lg:flex-row lg:gap-8 lg:items-center">
          <li className="hidden lg:flex items-center w-full lg:w-auto">
            <div className="flex items-center">
              <FaChess
                size={40}
                className="bg-blue-200 p-1 border-2 border-black rounded shadow-lg"
              />
              <NavLink
                to="/"
                className="font-semibold text-lg ml-2 select-none"
              >
                LJDR-Chess
              </NavLink>
            </div>
            <button className="lg:hidden text-xl" onClick={toggleMenu}>
              <LuAlignJustify />
            </button>
          </li>
          {Links.map((link) => (
            <li className="lg:m-0 mt-5 mb-5 ml-2" key={link.name}>
              <NavLink
                to={link.link}
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col lg:flex-row lg:gap-8 lg:items-center">
          {User.map((link) => (
            <li className="lg:m-0 mt-5 mb-5 ml-2" key={link.name}>
              <NavLink
                to={link.link}
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
          <li className="lg:m-0 mt-5 mb-5 ml-2">
            <NavLink
              to="/sign-in"
              className={({ isActive }) => (isActive ? activeStyle : undefined)}
            ></NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
