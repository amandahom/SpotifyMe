import { signIn, signOut, useSession } from 'next-auth/client'
import React from 'react'

interface toggleInterface {
  toggle: any
  isOpen: any
}

function Dropdown({ isOpen, toggle }: toggleInterface) {
  const [session, loading] = useSession()
  return (
    <>
      <div className={isOpen ? 'grid grid-rows-4 text-center items-center bg-yellow=500' : 'hidden'} onClick={toggle}>
        <div>
          {!session && (
            <>
              <div className="inline-block py-2 px-4 text-indigo-200 mr-2">Not signed in</div>
              <button
                onClick={() => signIn()}
                className="inline-block py-2 px-4 text-yellow-700 hover:text-yellow-800 bg-yellow-400 hover:bg-yellow-300 rounded transition ease-in duration-150"
              >
                Sign in
              </button>
            </>
          )}
          {session && (
            <>
              <img className="hidden md:inline-block py-2 px-4 w-24" src={session.user.picture}></img>
              <div className="block py-2 px-4 text-indigo-200 mr-2">Signed in as {session.user.name}</div>
              <button
                onClick={() => signOut()}
                className="block py-2 px-4 text-yellow-700 hover:text-yellow-800 bg-yellow-400 hover:bg-yellow-300 rounded transition ease-in duration-150"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Dropdown
