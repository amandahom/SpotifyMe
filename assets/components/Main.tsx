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
    if (value === 'Your Followed Artists') {
      setShowFollowedArtists(true)
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
      <div className="bg-indigo-50">
        <div className="shadow-md">
          <h1 className="md:text-2xl pt-4 pb-2 px-4 sm:px-10">Learn more about your music habits...</h1>
          <div className="overflow-hidden">
            <div className="px-4 pb-2 sm:px-10 sm:pb-6 mb-2 relative inline-flex bg-indigo-50">
              <svg
                className="w-3 h-2 absolute right-0 mr-8 sm:mr-14 mt-5 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 412 232"
              >
                <path
                  d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                  fill="#648299"
                  fillRule="nonzero"
                />
              </svg>
              <select
                ref={dropdownRef}
                onChange={e => handleChange(e)}
                className="border border-gray-300 rounded text-gray-600 h-12 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
              >
                <option value="">Select</option>
                <option value="Your Followed Artists" className="hover:bg-purple-200 cursor-pointer">
                  Your Followed Artists 👩🏻‍🎨
                </option>
                <option value="Your Top Artists" className="hover:bg-purple-200 cursor-pointer">
                  Your Top Artists 📈
                </option>
                <option value="Your Top Tracks" className="hover:bg-purple-200 cursor-pointer">
                  Your Top Tracks 📈
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
