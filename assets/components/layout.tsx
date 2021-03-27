import Head from 'next/head'
import * as React from 'react'
// import Footer from './footer'
import Header from './header'

const Layout = (props: any) => {
  return (
    <React.Fragment>
      <Head>
        <title>Spotify</title>
        <script src="https://kit.fontawesome.com/8805737f27.js" crossOrigin="anonymous"></script>
      </Head>

      <div>
        <Header />
        {props.children}

        {/* <Footer /> */}
      </div>
    </React.Fragment>
  )
}

export default Layout
