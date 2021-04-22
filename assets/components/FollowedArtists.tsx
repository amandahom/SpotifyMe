import { useSession } from 'next-auth/client'
import fetch from 'node-fetch'
import React, { useEffect, useState } from 'react'
import Loading from './Loading'

function FollowedArtists() {
  const [session, loading] = useSession()
  const [error, setError] = useState(null)
  const [followers, setFollowers] = useState()
  const [isLoaded, setIsLoaded] = useState(false)

  interface followersDataInterface {
    external_urls: urlInterface
    followers: fansInterface
    genres: Array<String>
    href: string
    images: Array<Object>
    name: string
    popularity: number
  }

  interface urlInterface {
    spotify: string
  }

  interface fansInterface {
    total: number
  }

  interface followersInterface {
    url: string
    fans: number
    genres: Array<String>
    href: string
    images: imagesInterface[]
    name: string
    popularity: number
  }

  interface imagesInterface {
    url: string
  }

  const requestUser = async (): Promise<any> => {
    try {
      let accessToken =
        session && session.user && session.user.accessToken && session.user.accessToken ? session.user.accessToken : ''

      const ENDPOINT: string = `https://api.spotify.com/v1/me/following?type=artist&limit=50`

      const followersInfo = await fetch(ENDPOINT, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const items = await followersInfo.json()
      console.log(items)
      const followers = items.artists.items.map((followers: followersDataInterface) => ({
        url: followers.external_urls.spotify,
        fans: followers.followers.total,
        genres: followers.genres,
        href: followers.href,
        images: followers.images,
        name: followers.name,
        popularity: followers.popularity,
      }))
      console.log(followers)
      // setFollowers(items)
      // console.log(setFollowers)

      return followers
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    async function getUserData() {
      if (session) {
        const res = await requestUser()
        console.log(res)
        setFollowers(res)
        setIsLoaded(true)
        console.log('Session exists.')
      } else {
        console.log('Session does not exist.')
      }
    }
    getUserData()
  }, [])

  const onSubmit = async (event: any) => {
    event.preventDefault()
  }

  // function search(followers) {
  //   return followers.filter(followers => followers.name.toLowerCase().indexOf(q) > -1)
  // }

  function FollowersCards(followers: followersInterface, index: number) {
    return (
      <div className="rounded overflow-hidden shadow-lg max-w-sm mb-8 md:mb-0 md:px-0" key={index}>
        <img className="w-full h-80" src={followers.images[0].url} alt="Artist Image"></img>

        <div className="px-6 pt-4 pb-2">
          <div className="font-bold text-xl mb-2">{followers.name}</div>
          <p className="text-gray-700 text-base">{followers.fans} Followers</p>
          <p className="text-gray-700 text-base">Popularity: {followers.popularity}</p>
          <a href={followers.url} target="_blank">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        </div>
        <div className="px-6 pt-4 pb-2">
          {followers.genres.map((genres: String, index: number) => {
            return (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                <p>{genres}</p>
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  if (error) {
    return <div>Error</div>
  } else if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loading />
      </div>
    )
  } else {
    return (
      <div>
        <div>
          {/* <input
            className="border-black border-solid border-opacity-100 bg-red outline-black"
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
          /> */}
        </div>
        <div className="p-5 sm:p-10 2xl:p-10 mx-2 md:mx-4 pb-10 grid col-start-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:gap-10">
          {followers.map((followers: followersInterface, index: number) => {
            return <FollowersCards {...followers} key={index} />
            // data={search(followers)}
          })}
        </div>
        <div className="flex justify-center">
          <button className="flex border border-indigo-300 bg-indigo-300 hover:bg-indigo-100 block rounded-sm font-bold py-4 px-6 justify-center items-center w-6/12 md:w-60">
            <p className="text-black pr-2">Next page</p>
            <svg className="w-6 h-6" fill="black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div className="pb-40"></div>
      </div>
    )
  }
}

export default FollowedArtists

// let topArtistsFansAscending = topArtists.sort(function(a: any, b: any) {
//   return a.fans - b.fans
// })

// let topArtistsFansDescending = topArtists.sort(function(a: any, b: any) {
//   return b.fans - a.fans
// })

// let topArtistsPopularityAscending = topArtists.sort(function(a: any, b: any) {
//   return a.popularity - b.popularity
// })

// let topArtistsPopularityDescending = topArtists.sort(function(a: any, b: any) {
//   return b.popularity - a.popularity
// })

// console.log(topArtistsFansAscending)
// console.log(topArtistsFansDescending)
// console.log(topArtistsPopularityAscending)
// console.log(topArtistsPopularityDescending)
