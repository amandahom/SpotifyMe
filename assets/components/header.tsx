import React, { useState } from 'react'

interface MenuItemsInterface {
  title: string
  url: string
  className: string
}

export const MenuItems: MenuItemsInterface[] = [
  {
    title: 'Home',
    url: '/',
    className: 'nav-links',
  },
  {
    title: 'Sign In',
    url: '/api/auth/signin/spotify',
    className: 'nav-links',
  },
]

function Header() {
  const [click, setClick] = useState(false)
  const handleCLick = () => setClick(!click)

  return (
    <nav className="NavbarItems">
      <div className="menu-icon" onClick={handleCLick}>
        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
      </div>
      <ul className={click ? 'nav-menu active' : 'nav-menu'}>
        {MenuItems.map((item, index) => {
          return (
            <li key={index}>
              <a className={item.className} href={item.url}>
                {item.title}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Header
