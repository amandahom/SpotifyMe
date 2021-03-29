import { signIn, signOut, useSession } from 'next-auth/client'
import Link from 'next/link'
import React from 'react'

// interface SessionInterface {
//   user: userInterface
//   expires: string
// }

// interface userInterace {
//   name: string
//   email: string
//   picture: string
//   sub: string
//   id: string
//   accessToken: string
//   iat: string
//   exp: string
// }

interface toggleInterface {
  toggle: any
}

function Header({ toggle }: toggleInterface) {
  const [session, loading] = useSession()
  return (
    <>
      <div className="bg-indigo-700 p-4 flex justify-between items-center relative shadow-sm">
        <div className="flex items-center">
          <Link href="/">
            <img
              src="https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Spotify-256.png"
              width="50"
              alt="logo"
              className="mr-2 cursor-pointer"
            ></img>
          </Link>
          <h1 className="inline-block p-2 text-indigo-200 mr-2 text-xl">Spotify</h1>
        </div>
        <div>
          {!session && (
            <>
              <div className="hidden md:inline-block py-2 px-4 text-indigo-200 mr-2">Not signed in</div>
              <button
                onClick={() => signIn()}
                className="inline-block py-2 px-4 text-yellow-700 hover:text-yellow-800 bg-yellow-400 hover:bg-yellow-300 rounded transition ease-in duration-150"
              >
                Sign in
              </button>
            </>
          )}
          <div>
            {session && (
              <>
                <div className="px-4 cursor-pointer sm:hidden " onClick={toggle}>
                  <svg className="w-6 h-6" fill="white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <Link href="/about">
                  <img
                    className="hidden md:inline-block py-1 px-4 w-24 cursor-pointer"
                    src={session.user.picture}
                  ></img>
                </Link>
                <div className="hidden sm:inline-block py-2 px-4 text-indigo-200 mr-2">
                  Signed in as {session.user.name}
                </div>
                <button
                  onClick={() => signOut()}
                  className="hidden sm:inline-block py-2 px-4 text-yellow-700 hover:text-yellow-800 bg-yellow-400 hover:bg-yellow-300 rounded transition ease-in duration-150"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
