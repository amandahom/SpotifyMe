import { useSession } from 'next-auth/client'
import fetch from 'node-fetch'
import React, { useEffect, useState } from 'react'
import Loading from './Loading'

function TopTracks() {
  const [session] = useSession()
  const [topTracks, setTopTracks] = useState<TopTracksInterface>()
  const [isLoaded, setIsLoaded] = useState(false)
  const [nextSearch, setNextSearch] = useState<string>()
  const [showNextButton, setShowNextButton] = useState(false)

  interface TopTracksDataInterface {
    external_urls: UrlInterface
    album: AlbumInterface
    images: Array<Object>
    artists: ArtistInterface[]
    name: string
    popularity: number
  }

  interface UrlInterface {
    spotify: string
  }

  interface AlbumInterface {
    release_date: string
    name: string
    images: Array<Object>
  }

  interface ArtistInterface {
    name: string
  }

  interface TopTracksInterface {
    map(arg0: (topTracks: TopTracksInterface, index: number) => JSX.Element): React.ReactNode
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

  const requestTopTracks = async (nextSearch = ''): Promise<any> => {
    try {
      let accessToken =
        session && session.user && session.user.accessToken && session.user.accessToken ? session.user.accessToken : ''

      const ENDPOINT: string = `https://api.spotify.com/v1/me/top/tracks`
      if (nextSearch) {
        let topTracksInfo = await fetch(nextSearch, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        let items = await topTracksInfo.json()
        let topTracks: TopTracksDataInterface = items.items.map((topTracks: TopTracksDataInterface) => ({
          url: topTracks.external_urls.spotify,
          releasedDate: topTracks.album.release_date,
          album: topTracks.album.name,
          images: topTracks.album.images,
          artist: topTracks.artists[0].name,
          trackName: topTracks.name,
          popularity: topTracks.popularity,
        }))
        let topTracksNextSearch: string = items.next
        return { topTracks: topTracks, topTracksNextSearch: topTracksNextSearch }
      } else {
        let topTracksInfo = await fetch(ENDPOINT, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        let items = await topTracksInfo.json()
        let topTracks: TopTracksDataInterface = items.items.map((topTracks: TopTracksDataInterface) => ({
          url: topTracks.external_urls.spotify,
          releasedDate: topTracks.album.release_date,
          album: topTracks.album.name,
          images: topTracks.album.images,
          artist: topTracks.artists[0].name,
          trackName: topTracks.name,
          popularity: topTracks.popularity,
        }))
        let topTracksNextSearch: string = items.next
        return { topTracks: topTracks, topTracksNextSearch: topTracksNextSearch }
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    async function getTopTracks() {
      if (session) {
        const res = await requestTopTracks()
        setTopTracks(res.topTracks)
        setShowNextButton(true)
        setIsLoaded(true)
      } else {
        console.log('Session does not exist.')
      }
    }
    getTopTracks()
  }, [])

  const scrollToTop = async () => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    }, 500)
  }

  const onSubmit = async (nextSearch: string) => {
    if (nextSearch) {
      let nextRes = await requestTopTracks(nextSearch)
      setTopTracks(nextRes.topTracks)
      setNextSearch(nextRes.topTracksNextSearch)
      setShowNextButton(true)
      if (nextRes.topTracksNextSearch === null) {
        setShowNextButton(false)
      }
      setIsLoaded(true)
    } else {
      const res = await requestTopTracks()
      let nextSearch: string = res && res.topTracksNextSearch
      let nextRes = await requestTopTracks(nextSearch)
      setTopTracks(nextRes.topTracks)
      setShowNextButton(true)
      setNextSearch(nextRes.topTracksNextSearch)
      setIsLoaded(true)
    }
  }

  function TopTracksCards(topTracks: TopTracksInterface, index: number) {
    return (
      <div
        className="rounded overflow-hidden shadow-lg max-w-sm 2xl:max-w-xs mb-8 md:mb-0 md:px-0 transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-105 transform hover:shadow-2xl bg-white"
        key={index}
      >
        <img className="w-full h-80" src={topTracks.images[0].url} alt="Artist Image"></img>
        <div className="px-6 pt-4 pb-10 grid gap-2 grid-cols-3 grid-rows-2">
          <div className="font-bold text-xl col-span-2">{topTracks.trackName}</div>
          <a href={topTracks.url} target="_blank" className="col-span-1 justify-self-end">
            <svg className="w-10 h-10" fill="black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
          <div className="text-lg mb-1 col-span-2">
            <p>{topTracks.artist}</p>
            <p className="text-sm">{topTracks.album}</p>
          </div>

          <div className="col-span-3">
            <p className="text-black-700 text-base">
              <b>Popularity:</b> {topTracks.popularity}
            </p>
            <p className="text-black-700 text-base">
              <b>Released Date:</b> {topTracks.releasedDate}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    )
  } else {
    return (
      <div>
        {topTracks && (
          <div className="p-5 sm:p-10 2xl:p-10 mx-2 md:mx-4 lg:mx-10 pb-10 grid col-start-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:gap-10 justify-items-center">
            {topTracks &&
              topTracks.map((topTracks: TopTracksInterface, index: number) => {
                return <TopTracksCards {...topTracks} key={index} />
              })}
          </div>
        )}
        {showNextButton ? (
          <div>
            <div className="flex justify-center mx-10">
              <button
                className="flex border bg-blue-300 hover:bg-blue-200 hover:border-blue-700 rounded transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-y-100 transform hover:shadow-2xl py-4 px-6 justify-center items-center w-7/12 md:w-60 lg:w-40 focus:outline-none"
                onClick={() => {
                  onSubmit(nextSearch as string)
                }}
              >
                <p className="text-black-700 hover:text-blue-700 pr-2">Next Page</p>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : null}
        <div className="pb-40">
          <svg
            className="w-14 h-14 animate-bounce absolute sm:ml-10 ml-4 cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            onClick={scrollToTop}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
            ></path>
          </svg>
        </div>
      </div>
    )
  }
}

export default TopTracks
