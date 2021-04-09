import Layout from 'assets/components/Layout'
import { useSession } from 'next-auth/client'
import fetch from 'node-fetch'
import React, { useEffect, useState } from 'react'
import Loading from '../assets/components/Loading'

interface DataInterface {
  country: string
  display_name: string
  email: string
  external_urls: ProfileInterface
  followers: FollowersInterface
}

interface ProfileInterface {
  spotify: string
}

interface FollowersInterface {
  total: number
}

interface SessionInterface {
  country: string
  displayName: string
  email: string
  externalURL: string
  followers: number
}

function About() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [user, setUser] = useState<SessionInterface>()
  const [session, loading] = useSession()

  const requestUser = async (): Promise<any> => {
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
      return getUser(data)
    } catch (err) {
      console.log(err)
    }
    function getUser(data: DataInterface) {
      const country: string = `${data['country']}`
      const displayName: string = `${data['display_name']}`.split(' ')[0]
      const email: string = `${data['email']}`
      const externalURL: string = `${data['external_urls']['spotify']}`
      const followers: number = parseInt(`${data['followers']['total']}`)

      return {
        country,
        displayName,
        email,
        externalURL,
        followers,
      }
    }
  }

  useEffect(() => {
    async function getUserData() {
      if (session) {
        let userData = await requestUser()
        setUser(userData)
        setIsLoaded(true)
        console.log('Session exists.')
      } else {
        console.log('Session does not exist.')
      }
    }
    getUserData()
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>
  } else if (!isLoaded) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <Loading />
        </div>
      </Layout>
    )
  } else {
    return (
      <Layout>
        <div>
          <h1 className="sm:text-5xl text-3xl p-6 text-center">Hey {user && user.displayName}!</h1>
          <div className="block md:grid grid-rows-2 grid-flow-col gap-4">
            <div className="row-span-2">
              <iframe
                src="https://open.spotify.com/embed/playlist/1ubXflHVEom74iaI4Gi8cz"
                width="300"
                height="380"
                frameBorder="0"
                allowTransparency={true}
                allow="encrypted-media"
              ></iframe>
            </div>
            <div className="text-center col-span-3">
              <h1 className="text-3xl col-start-2 col-end-2"># of followers:</h1>{' '}
              {user && <p className="text-9xl">{user.followers}</p>}
            </div>

            <div className="text-center  col-span-3">
              {user && (
                <div className="">
                  <a href={user.externalURL}>
                    <h1 className="text-3xl col-start-2 col-end-2">Listen now</h1>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default About
