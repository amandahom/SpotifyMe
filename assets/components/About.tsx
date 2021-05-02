import Loading from 'assets/components/Loading'
import { useSession } from 'next-auth/client'
import fetch from 'node-fetch'
import React, { useEffect, useState } from 'react'

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

interface PlaylistDataInterface {
  added_at: string
  track: TracksDataInterface
}

interface TracksDataInterface {
  external_urls: UrlInterface
  album: AlbumInterface
  name: string
  artists: ArtistsInterface
}

interface UrlInterface {
  spotify: string
}

interface AlbumInterface {
  images: Array<Object>
  name: string
}

interface ArtistsInterface {
  [0]: ArtistsNameInterface
}

interface ArtistsNameInterface {
  name: string
}

interface TracksInterface {
  map(arg0: (tracks: TracksInterface, index: number) => JSX.Element): React.ReactNode
  added_at: string
  albumName: string
  artistName: string
  external_urls: string
  images: ImagesInterface[]
  name: string
}

interface ImagesInterface {
  url: string
}

function About() {
  const [error, setError] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [user, setUser] = useState<SessionInterface>()
  const [tracks, setTracks] = useState<TracksInterface>()
  const [session] = useSession()

  const requestUser = async (): Promise<any> => {
    try {
      let accessToken =
        session && session.user && session.user.accessToken && session.user.accessToken ? session.user.accessToken : ''

      const ENDPOINT: string = `https://api.spotify.com/v1/me`

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

  const requestPlaylist = async (): Promise<any> => {
    try {
      let accessToken =
        session && session.user && session.user.accessToken && session.user.accessToken ? session.user.accessToken : ''

      const ENDPOINT: string = `https://api.spotify.com/v1/playlists/0bUsfKxond7zP7H0XmJXve`

      const response = await fetch(ENDPOINT, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const data = await response.json()
      let tracksInfo: PlaylistDataInterface = data.tracks.items.map((tracksInfo: PlaylistDataInterface) => ({
        added_at: tracksInfo.added_at.toString().slice(0, 10),
        external_urls: tracksInfo.track.external_urls.spotify,
        images: tracksInfo.track.album.images,
        name: tracksInfo.track.name,
        artistName: tracksInfo.track.artists[0].name,
        albumName: tracksInfo.track.album.name,
      }))

      // let description: string = `${data['description']}`
      // let playlistName: string = `${data['name']}`
      // let playlistImage: string = `${data['images'][0]['url']}`
      // let playlistURL: string = `${data['external_urls']['spotify']}`

      return {
        tracksInfo: tracksInfo,
        // description: description,
        // playlistName: playlistName,
        // playlistImage: playlistImage,
        // playlistURL: playlistURL,
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    async function getUserData() {
      if (session) {
        let userData = await requestUser()
        let playlistData = await requestPlaylist()
        setUser(userData)
        setTracks(playlistData.tracksInfo)
        setIsLoaded(true)
      } else {
        setError('Please log in.')
        console.log('Session does not exist.')
      }
    }
    getUserData()
  }, [])

  if (error) {
    return <div>Could not get results.</div>
  } else if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    )
  } else {
    return (
      <div>
        <h1 className="sm:text-4xl text-3xl py-4 px-6 sm:mt-10 mt-4 text-center">Hey {user && user.displayName}!</h1>
        <div className="text-center py-2">
          <h1 className="text-lg">
            <span className="bg-blue-400 py-2 px-2 rounded-sm text-white text-md">{user && user.followers}</span>{' '}
            friends follow you
          </h1>
        </div>

        <div className="text-center">
          {user && (
            <h1 className="text-xl py-2">
              Listen to your Spotify now{' '}
              <div className="inline-block">
                <a href={user.externalURL} target="_blank">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                </a>
              </div>
            </h1>
          )}
        </div>
        <h1 className="sm:text-xl text-md pt-3 pb-6 text-center font-bold">Recent songs that Mandy is addicted to:</h1>
        <div className="flex flex-col 2xl:mx-96 mx-0 px-6 2xl:px-40">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                      ></th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Track / Artist
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Album
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date Added
                      </th>
                    </tr>
                  </thead>
                  {tracks && (
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tracks.map((tracks: TracksInterface, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                            <a
                              href={tracks.external_urls}
                              target="_blank"
                              className="col-span-1 justify-self-end cursor-pointer"
                            >
                              <svg
                                className="w-10 h-10"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </a>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-sm" src={tracks.images[0].url} alt="Album Image" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{tracks.name}</div>
                                <div className="text-sm text-gray-500">{tracks.artistName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{tracks.albumName}</div>
                          </td>

                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{tracks.added_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="pb-48"></div>
      </div>
    )
  }
}

export default About
