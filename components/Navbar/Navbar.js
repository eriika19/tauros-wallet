import React, { useState } from 'react';
import Link from 'next/link';

import { NavbarItem } from './';

const NAV_ITEMS = [
  { page: 'Inicio', route: '/' },
  { page: 'Mapa', route: '/mapa' },
  { page: 'Oriental', route: '/oriental' },
  { page: 'Postres', route: '/postres' },
  { page: 'Vegetariana', route: '/vegetariana' },
  { page: 'Cafecito', route: '/cafecito' },
];

const Navbar = props => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className='navbar is-fixed-top'>
      <div className='container'>
        <div className='navbar-brand'>
          <Link href='/'>
            <figure className='image is-128x128 nav-logo'>
              <img src='/logo.png' alt='logo' />
            </figure>
          </Link>
          <span
            className={isNavOpen ? 'navbar-burger is-active' : 'navbar-burger'}
            data-target='navbarMenuHeroB'
            onClick={toggle}
          >
            <span className='is-nice-blue'></span>
            <span className='is-nice-blue'></span>
            <span className='is-nice-blue'></span>
          </span>
        </div>
        <div className={isNavOpen ? 'navbar-menu is-active' : 'navbar-menu'} id='navbarMenuHeroB'>
          <div className={isNavOpen ? 'navbar-end is-active' : 'navbar-end'}>
            <NavbarItem {...NAV_ITEMS[0]} {...props} />
            <NavbarItem {...NAV_ITEMS[1]} {...props} />
            <div className='navbar-item has-dropdown is-hoverable'>
              <hr className='navbar-divider' />
              <a className='navbar-link is-nice-blue'>Comida</a>
              <div className='navbar-dropdown is-boxed is-right'>
                <NavbarItem {...NAV_ITEMS[2]} {...props} />
                <NavbarItem {...NAV_ITEMS[3]} {...props} />
                <NavbarItem {...NAV_ITEMS[4]} {...props} />
                <NavbarItem {...NAV_ITEMS[5]} {...props} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .nav-logo img {
            width: 6.5rem;
            height: auto;
            cursor: pointer;
          }
          @media (max-width: 1023px) {
            .navbar-menu {
              height: 100vh;
            }
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
