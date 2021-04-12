import { useSession } from 'next-auth/client'
import fetch from 'node-fetch'
import React, { useEffect, useState } from 'react'
import Loading from './Loading'

function TopTracks() {
  const [session, loading] = useSession()
  const [error, setError] = useState(null)
  const [topTracks, setTopTracks] = useState()
  const [isLoaded, setIsLoaded] = useState(false)

  interface topTracksDataInterface {
    external_urls: urlInterface
    album: albumInterface
    images: Array<Object>
    artists: artistInterface[]
    name: string
    popularity: number
  }

  interface urlInterface {
    spotify: string
  }

  interface albumInterface {
    release_date: string
    name: string
    images: Array<Object>
  }

  interface artistInterface {
    name: string
  }

  interface topTracksInterface {
    album: string
    artist: string
    url: string
    images: imagesInterface[]
    releasedDate: string
    trackName: string
    popularity: number
  }

  interface imagesInterface {
    url: string
  }

  const requestTopTracks = async (): Promise<any> => {
    try {
      let accessToken =
        session && session.user && session.user.accessToken && session.user.accessToken ? session.user.accessToken : ''

      const ENDPOINT: string = `https://api.spotify.com/v1/me/top/tracks`

      const topTracksInfo = await fetch(ENDPOINT, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const items = await topTracksInfo.json()
      console.log(items)
      const topTracks = items.items.map((topTracks: topTracksDataInterface) => ({
        url: topTracks.external_urls.spotify,
        releasedDate: topTracks.album.release_date,
        album: topTracks.album.name,
        images: topTracks.album.images,
        artist: topTracks.artists[0].name,
        trackName: topTracks.name,
        popularity: topTracks.popularity,
      }))

      console.log(topTracks)

      return topTracks
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    async function getTopTracks() {
      if (session) {
        const res = await requestTopTracks()
        console.log(res)
        setTopTracks(res)
        setIsLoaded(true)
        console.log('Session exists.')
      } else {
        console.log('Session does not exist.')
      }
    }
    getTopTracks()
  }, [])

  const onSubmit = async (event: any) => {
    event.preventDefault()
  }

  // function search(followers) {
  //   return followers.filter(followers => followers.name.toLowerCase().indexOf(q) > -1)
  // }

  function TopTracksCards(topTracks: topTracksInterface, index: number) {
    return (
      <div className="rounded overflow-hidden shadow-lg max-w-sm mb-8 md:mb-0 md:px-0" key={index}>
        <img className="w-full h-80" src={topTracks.images[0].url} alt="Artist Image"></img>

        <div className="px-6 pt-4 pb-2">
          <div className="font-bold text-xl mb-2">{topTracks.trackName}</div>
          <p className="text-gray-700 text-base">{topTracks.artist}</p>
          <p className="text-gray-700 text-base">{topTracks.album}</p>
          <p className="text-gray-700 text-base">Followers</p>
          <p className="text-gray-700 text-base">Released Date: {topTracks.releasedDate}</p>
          <p className="text-gray-700 text-base">Popularity: {topTracks.popularity}</p>
          <a href={topTracks.url} target="_blank">
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
          {/* {topTracks.genres.map((genres: String, index: number) => {
            return (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                <p>{genres}</p>
              </span>
            )
          })} */}
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
          {topTracks.map((topTracks: topTracksInterface, index: number) => {
            return <TopTracksCards {...topTracks} key={index} />
            // data={search(followers)}
          })}
        </div>
        <div className="flex justify-center">
          <button className="flex border border-indigo-300 bg-indigo-300 hover:bg-indigo-100 block rounded-sm font-bold py-4 px-6 justify-center items-center w-6/12 md:w-60">
            <p className="text-black pr-2">Next page</p>
            <svg className="w-6 h-6" fill="black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div className="pb-40"></div>
      </div>
    )
  }
}

export default TopTracks
