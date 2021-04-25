import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Dropdown from './Dropdown'
import Footer from './Footer'
import Header from './Header'

const Layout = (props: any) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => {
    setIsOpen(!isOpen)
  }
  useEffect(() => {
    const hideMenu = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', hideMenu)
    return () => {
      window.removeEventListener('resize', hideMenu)
    }
  })
  return (
    <React.Fragment>
      <Head>
        <title>SpotifyMe</title>
      </Head>

      <Header toggle={toggle} />
      <Dropdown isOpen={isOpen} toggle={toggle} />
      {props.children}

      <Footer />
    </React.Fragment>
  )
}

export default Layout
