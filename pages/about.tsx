import Layout from 'assets/components/Layout'
import { useSession } from 'next-auth/client'
import fetch from 'node-fetch'
import React, { useState } from 'react'

function About() {
  const [session, loading] = useSession()
  // const [user, setUser] = useState([]);
  const [user, setUser] = useState()
  if (loading) return null
  // getUser()
  console.log(user)

  async function getUser() {
    try {
      let accessToken =
        session && session.user && session.user.accessToken && session.user.accessToken ? session.user.accessToken : ''

      const ENDPOINT = `https://api.spotify.com/v1/me`

      const response = await fetch(ENDPOINT, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const data = await response.json()
      //   if (userDataRes) {
      //     return res.status(200).json(userDataRes)
      //   } else {
      //     return new Error('No user found')
      //   }
      getDetails(data)
    } catch (err) {
      console.log(err)
    }
    return
  }

  function getDetails(data: SessionInterface) {
    const country: string = `${data['country']}`
    const name: string = `${data['display_name']}`
    let firstName = name.replace(/ .*/, '')
    if (firstName === '') {
      firstName = 'there'
    }
    const email: string = `${data['email']}`
    const profileLink: string = `${data['external_urls']['spotify']}`
    const followers: number = parseInt(`${data['followers']['total']}`)
    const userData: Array<string | number> = []
    userData.push(country, firstName, email, profileLink, followers)
    // setUser(country, firstName, email, profileLink, followers)
    // console.log(userData)
    // return userData
    setUser(userData)
    console.log(userData)
    // return {
    //   country,
    //   firstName,
    //   email,
    //   profileLink,
    //   followers,
    // }
  }

  // interface UserInterface {
  //   country: string
  //   firstName: string
  //   email: string
  //   profileLink: string
  //   followers: number
  // }

  interface SessionInterface {
    country: string
    display_name: string
    email: string
    external_urls: ProfileInterface
    followers: FollowersInterface
  }

  interface FollowersInterface {
    href: null
    total: number
  }

  interface ProfileInterface {
    spotify: string
  }

  return (
    <Layout>
      <div>
        <h1 className="sm:text-5xl text-3xl p-6">Hey {user}!</h1>

        <div>
          <h2>Want to listen to Spotify right now?</h2>
          {/* <a href={data.listenNow}>Click here.</a> */}
        </div>
      </div>
    </Layout>
  )
}

export default About
