import FollowedArtists from 'assets/components/FollowedArtists'
import TopArtists from 'assets/components/TopArtists'
import TopTracks from 'assets/components/TopTracks'
import { useRef, useState } from 'react'

function Main(this: any) {
  const [showFollowedArtists, setShowFollowedArtists] = useState(false)
  const [showTopArtists, setShowTopArtists] = useState(false)
  const [showTopTracks, setShowTopTracks] = useState(false)
  const dropdownRef = useRef(null)
  // const userArtistsOnClick = () => {
  //   setShowFollowedArtists(true)
  //   setShowTopArtists(false)
  //   setShowTopTracks(false)
  // }
  // const userTopArtistsOnClick = () => {
  //   setShowTopArtists(true)
  //   setShowFollowedArtists(false)
  //   setShowTopTracks(false)
  // }
  // const userTopTracksOnClick = () => {
  //   setShowTopTracks(true)
  //   setShowTopArtists(false)
  //   setShowFollowedArtists(false)
  // }
  function handleChange(e: any) {
    let value = e && e.target && e.target.value
    console.log(value)
    if (value === 'Your Followed Artists') {
      setShowFollowedArtists(true)
      console.log('selected')
      setShowTopArtists(false)
      setShowTopTracks(false)
    } else if (value === 'Your Top Artists') {
      setShowTopArtists(true)
      setShowFollowedArtists(false)
      setShowTopTracks(false)
    } else if (value === 'Your Top Tracks') {
      setShowTopTracks(true)
      setShowTopArtists(false)
      setShowFollowedArtists(false)
    } else {
      console.log('Nothing Selected')
    }
  }

  return (
    <div>
      <div>
        <div className="col-span-6 sm:col-span-3">
          <select
            ref={dropdownRef}
            onChange={e => handleChange(e)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
        {/* <input
          type="submit"
          value="Your Followed Artists"
          onClick={userArtistsOnClick}
          className="hover:bg-purple-200 cursor-pointer"
        /> */}

        {/* <input
          type="submit"
          value="Your Top Artists"
          onClick={userTopArtistsOnClick}
          className="hover:bg-purple-200 cursor-pointer"
        /> */}
        {/* <input
          type="submit"
          value="Your Top Tracks"
          onClick={userTopTracksOnClick}
          className="hover:bg-purple-200 cursor-pointer"
        /> */}
      </div>
      <div>
        {showFollowedArtists ? <FollowedArtists /> : null}
        {showTopArtists ? <TopArtists /> : null}
        {showTopTracks ? <TopTracks /> : null}
      </div>
    </div>
  )
}

export default Main
