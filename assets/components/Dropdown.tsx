import { signIn, signOut, useSession } from 'next-auth/client'
import React from 'react'

interface toggleInterface {
  toggle: any
  isOpen: any
}

function Dropdown({ isOpen, toggle }: toggleInterface) {
  const [session] = useSession()
  return (
    <>
      <div className={isOpen ? 'text-center items-center' : 'hidden'} onClick={toggle}>
        <div>
          {!session && (
            <>
              <div className="bg-indigo-500 py-6">
                <div className="inline-block py-2 px-4 text-indigo-100 pb-5">Not signed in</div>
                <button
                  onClick={() => signIn()}
                  className="block py-2 px-4 my-1 mx-auto text-indigo-700 hover:text-indigo-100 bg-indigo-200 hover:bg-indigo-500 border-indigo-200 border-2 rounded transition ease-in duration-150 cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            </>
          )}
          {session && (
            <>
              <div className="bg-indigo-500 py-6">
                <div className="block py-2 px-4 text-indigo-100 pb-5">Signed in as {session.user.name}</div>
                <button
                  onClick={() => signOut()}
                  className="block py-2 px-4 my-1 mx-auto text-indigo-700 hover:text-indigo-100 bg-indigo-200 hover:bg-indigo-500 border-indigo-200 border-2 rounded transition ease-in duration-150 cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Dropdown
