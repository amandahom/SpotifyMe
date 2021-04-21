import { useSession } from 'next-auth/client'
import fetch from 'node-fetch'
import React, { useEffect, useState } from 'react'
import Loading from './Loading'

function TopArtists() {
  const [session, loading] = useSession()
  const [error, setError] = useState(null)
  const [topArtists, setTopArtists] = useState()
  const [isLoaded, setIsLoaded] = useState(false)
  const [nextSearch, setNextSearch] = useState()
  const [showNextButton, setShowNextButton] = useState(false)

  interface topArtistsDataInterface {
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

  interface topArtistsInterface {
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

  const requestTopArtists = async (nextSearch = ''): Promise<any> => {
    try {
      let accessToken =
        session && session.user && session.user.accessToken && session.user.accessToken ? session.user.accessToken : ''

      const ENDPOINT: string = `https://api.spotify.com/v1/me/top/artists`

      if (nextSearch) {
        let topArtistInfo = await fetch(nextSearch, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        let items = await topArtistInfo.json()
        let topArtists = items.items.map((topArtists: topArtistsDataInterface) => ({
          url: topArtists.external_urls.spotify,
          fans: topArtists.followers.total,
          genres: topArtists.genres,
          href: topArtists.href,
          images: topArtists.images,
          name: topArtists.name,
          popularity: topArtists.popularity,
        }))

        let topArtistsNextSearch: string = items.next
        return { topArtists: topArtists, topArtistsNextSearch: topArtistsNextSearch }
      } else {
        let topArtistInfo = await fetch(ENDPOINT, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        let items = await topArtistInfo.json()
        let topArtists = items.items.map((topArtists: topArtistsDataInterface) => ({
          url: topArtists.external_urls.spotify,
          fans: topArtists.followers.total,
          genres: topArtists.genres,
          href: topArtists.href,
          images: topArtists.images,
          name: topArtists.name,
          popularity: topArtists.popularity,
        }))

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

        let topArtistsNextSearch: string = items.next
        return { topArtists: topArtists, topArtistsNextSearch: topArtistsNextSearch }
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    async function getTopArtists() {
      if (session) {
        const res = await requestTopArtists()
        console.log(res)
        setTopArtists(res.topArtists)
        setShowNextButton(true)
        setIsLoaded(true)
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
          })
        }, 500)

        console.log('Session exists.')
      } else {
        console.log('Session does not exist.')
      }
    }
    getTopArtists()
  }, [])

  const onSubmit = async (nextSearch: string) => {
    if (nextSearch) {
      let nextRes = await requestTopArtists(nextSearch)
      setTopArtists(nextRes.topArtists)
      setNextSearch(nextRes.topArtistsNextSearch)
      setShowNextButton(true)
      console.log(nextRes)
      if (nextRes.topArtistsNextSearch === null) {
        setShowNextButton(false)
      }
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
      setIsLoaded(true)
    } else {
      const res = await requestTopArtists()
      let nextSearch = res && res.topArtistsNextSearch
      let nextRes = await requestTopArtists(nextSearch)
      setTopArtists(nextRes.topArtists)
      setShowNextButton(true)
      console.log(nextRes)
      setNextSearch(nextRes.topArtistsNextSearch)
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
      setIsLoaded(true)
    }
  }

  // function search(followers) {
  //   return followers.filter(followers => followers.name.toLowerCase().indexOf(q) > -1)
  // }

  function TopArtistsCards(topArtists: topArtistsInterface, index: number) {
    return (
      <div className="rounded overflow-hidden shadow-lg max-w-sm mb-8 md:mb-0 md:px-0" key={index}>
        <img className="w-full h-80" src={topArtists.images[0].url} alt="Artist Image"></img>
        <div className="px-6 pt-4 pb-2 grid gap-2 grid-cols-3 grid-rows-2">
          <div className="font-bold text-xl mb-1 col-span-2">{topArtists.name}</div>
          <a href={topArtists.url} target="_blank" className="col-span-1 justify-self-end">
            <svg className="w-10 h-10" fill="black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
          <div className="col-span-3">
            <p className="text-black-700 text-base">
              <b>Followers:</b> {topArtists.fans}{' '}
            </p>
            <p className="text-black-700 text-base">
              <b>Popularity:</b> {topArtists.popularity}
            </p>
          </div>
        </div>
        <div className="px-6 pt-4 pb-2">
          {topArtists.genres.map((genres: String, index: number) => {
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
        <div className="p-5 sm:p-10 2xl:p-10 mx-2 md:mx-4 pb-10 grid col-start-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:gap-10">
          {topArtists.map((topArtists: topArtistsInterface, index: number) => {
            return <TopArtistsCards {...topArtists} key={index} />
            // data={search(followers)}
          })}
        </div>
        {showNextButton ? (
          <div>
            <div className="flex justify-center mx-10">
              <button
                className="flex border bg-yellow-400 hover:bg-yellow-300 rounded transition ease-in duration-150 py-4 px-6 justify-center items-center w-7/12 md:w-60 lg:w-40 focus:outline-none"
                onClick={() => {
                  onSubmit(nextSearch)
                }}
              >
                <p className="text-yellow-700 hover:text-yellow-800 pr-2">Next Page</p>
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
        <div className="pb-40"></div>
      </div>
    )
  }
}

export default TopArtists
