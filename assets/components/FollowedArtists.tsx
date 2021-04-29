import { useSession } from 'next-auth/client'
import fetch from 'node-fetch'
import React, { useEffect, useState } from 'react'
import Loading from './Loading'

function FollowedArtists() {
  const [session] = useSession()
  const [followers, setFollowers] = useState<FollowersInterface>()
  const [isLoaded, setIsLoaded] = useState(false)
  const [nextSearch, setNextSearch] = useState<string>()
  const [showNextButton, setShowNextButton] = useState(false)

  interface FollowersDataInterface {
    external_urls: UrlInterface
    followers: FansInterface
    genres: Array<String>
    href: string
    images: Array<Object>
    name: string
    popularity: number
  }

  interface UrlInterface {
    spotify: string
  }

  interface FansInterface {
    total: number
  }

  interface FollowersInterface {
    map(arg0: (followers: FollowersInterface, index: number) => JSX.Element): React.ReactNode
    url: string
    fans: number
    genres: Array<String>
    href: string
    images: ImagesInterface[]
    name: string
    popularity: number
  }

  interface ImagesInterface {
    url: string
  }

  const requestFollowedArtists = async (nextSearch = ''): Promise<any> => {
    try {
      let accessToken =
        session && session.user && session.user.accessToken && session.user.accessToken ? session.user.accessToken : ''

      const ENDPOINT: string = `https://api.spotify.com/v1/me/following?type=artist`
      if (nextSearch) {
        let followersInfo = await fetch(nextSearch, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        let items = await followersInfo.json()

        let followers: FollowersDataInterface = items.artists.items.map((followers: FollowersDataInterface) => ({
          url: followers.external_urls.spotify,
          fans: followers.followers.total,
          genres: followers.genres,
          href: followers.href,
          images: followers.images,
          name: followers.name,
          popularity: followers.popularity,
        }))

        let followedArtistsNextSearch: string = items.artists.next
        return { followers: followers, followedArtistsNextSearch: followedArtistsNextSearch }
      } else {
        let followersInfo = await fetch(ENDPOINT, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        let items = await followersInfo.json()
        let followers: FollowersDataInterface = items.artists.items.map((followers: FollowersDataInterface) => ({
          url: followers.external_urls.spotify,
          fans: followers.followers.total,
          genres: followers.genres,
          href: followers.href,
          images: followers.images,
          name: followers.name,
          popularity: followers.popularity,
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

        let followedArtistsNextSearch: string = items.artists.next
        return { followers: followers, followedArtistsNextSearch: followedArtistsNextSearch }
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    async function getFollowersData() {
      if (session) {
        const res = await requestFollowedArtists()
        setFollowers(res.followers)
        setShowNextButton(true)
        setIsLoaded(true)
      } else {
        console.log('Session does not exist.')
      }
    }
    getFollowersData()
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
      let nextRes = await requestFollowedArtists(nextSearch)
      setFollowers(nextRes.followers)
      setNextSearch(nextRes.followedArtistsNextSearch)
      setShowNextButton(true)
      if (nextRes.followedArtistsNextSearch === null) {
        setShowNextButton(false)
      }
      setIsLoaded(true)
    } else {
      const res = await requestFollowedArtists()
      let nextSearch: string = res && res.followedArtistsNextSearch
      let nextRes = await requestFollowedArtists(nextSearch)
      setFollowers(nextRes.followers)
      setShowNextButton(true)
      setNextSearch(nextRes.followedArtistsNextSearch)
      setIsLoaded(true)
    }
  }

  function FollowersCards(followers: FollowersInterface, index: number) {
    return (
      <div
        className="rounded overflow-hidden shadow-lg max-w-sm 2xl:max-w-xs mb-8 md:mb-0 md:px-0 transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-105 transform hover:shadow-2xl bg-white"
        key={index}
      >
        <img className="w-full h-80" src={followers.images[0].url} alt="Artist Image"></img>
        <div className="px-6 pt-4 pb-2 grid gap-2 grid-cols-3 grid-rows-2">
          <div className="font-bold text-xl mb-1 col-span-2">{followers.name}</div>
          <a href={followers.url} target="_blank" className="col-span-1 justify-self-end">
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
              <b>Followers:</b> {followers.fans}
            </p>
            <p className="text-black-700 text-base">
              <b>Popularity:</b> {followers.popularity}
            </p>
          </div>
        </div>
        {followers && (
          <div className="px-6 pt-4 pb-2">
            {followers &&
              followers.genres &&
              followers.genres.map((genres: String, index: number) => {
                return (
                  <span
                    key={index}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-indigo-200"
                  >
                    <p>{genres}</p>
                  </span>
                )
              })}
          </div>
        )}
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
        {followers && (
          <div className="p-5 sm:p-10 2xl:p-10 mx-2 md:mx-4 lg:mx-10 pb-10 grid col-start-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:gap-10 justify-items-center">
            {followers &&
              followers.map((followers: FollowersInterface, index: number) => {
                return <FollowersCards {...followers} key={index} />
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

export default FollowedArtists
