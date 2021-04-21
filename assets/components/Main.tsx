import About from 'assets/components/About'
import FollowedArtists from 'assets/components/FollowedArtists'
import Loading from 'assets/components/Loading'
import TopArtists from 'assets/components/TopArtists'
import TopTracks from 'assets/components/TopTracks'
import { useSession } from 'next-auth/client'
import { useEffect, useRef, useState } from 'react'

function Main(this: any) {
  const [showFollowedArtists, setShowFollowedArtists] = useState(false)
  const [showTopArtists, setShowTopArtists] = useState(false)
  const [showTopTracks, setShowTopTracks] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const dropdownRef = useRef(null)
  const [session, loading] = useSession()
  const [isLoaded, setIsLoaded] = useState(false)
  function handleChange(e: any) {
    let value = e && e.target && e.target.value
    console.log(value)
    if (value === 'Your Followed Artists') {
      setShowFollowedArtists(true)
      console.log('selected')
      setShowTopArtists(false)
      setShowTopTracks(false)
      setShowAbout(false)
    } else if (value === 'Your Top Artists') {
      setShowTopArtists(true)
      setShowFollowedArtists(false)
      setShowTopTracks(false)
      setShowAbout(false)
    } else if (value === 'Your Top Tracks') {
      setShowTopTracks(true)
      setShowTopArtists(false)
      setShowFollowedArtists(false)
      setShowAbout(false)
    } else {
      console.log('Nothing Selected')
    }
  }

  useEffect(() => {
    async function getUserData() {
      if (session) {
        setShowAbout(true)
        setIsLoaded(true)
        console.log('Session exists.')
      } else {
        console.log('Session does not exist.')
      }
    }
    getUserData()
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loading />
      </div>
    )
  } else {
    return (
      <div>
        <div>
          <div className="shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 bg-white sm:p-6">
              <select
                ref={dropdownRef}
                onChange={e => handleChange(e)}
                className="mx-4 inline-block w-11/12 py-2 px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select</option>
                <option value="Your Followed Artists" className="hover:bg-purple-200 cursor-pointer">
                  Your Followed Artists
                </option>
                <option value="Your Top Artists" className="hover:bg-purple-200 cursor-pointer">
                  Your Top Artists
                </option>
                <option value="Your Top Tracks" className="hover:bg-purple-200 cursor-pointer">
                  Your Top Tracks
                </option>
              </select>
            </div>
          </div>
        </div>
        <div>
          {showAbout ? <About /> : null}
          {showFollowedArtists ? <FollowedArtists /> : null}
          {showTopArtists ? <TopArtists /> : null}
          {showTopTracks ? <TopTracks /> : null}
        </div>
      </div>
    )
  }
}

export default Main
