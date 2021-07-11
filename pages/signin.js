import { getSession, providers, signIn } from 'next-auth/client'
import React from 'react'

function SignIn({ providers }) {
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative top-0 bg-blue-300">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl">
          <div>
            <img
              className="mx-auto h-24 w-auto"
              src="https://cdn1.iconfinder.com/data/icons/brands-jolly/224/spotify-social-network-brand-logo-256.png"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your Spotify account</h2>
          </div>

          <div>
            {Object.values(providers).map((provider, index) => {
              return (
                <button
                  key={index}
                  type="submit"
                  onClick={() => signIn(provider.id, { callbackUrl: 'https://spotifyme.amandahom.com/' })}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  Sign in
                </button>
              )
            })}
          </div>
          <div>
            <h1 className="mt-10 text-lg text-black py-4 text-center">
              Here is a short video to view the project if you prefer to not sign in with your email address.
              <div className="p-4">
                <a
                  target="_blank"
                  className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-500 hover:bg-purple-700"
                  href="https://youtu.be/DRw-771oh9I"
                >
                  View Video
                </a>
              </div>
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}

SignIn.getInitialProps = async (context) => {
  const { req, res } = context
  const session = await getSession({ req })

  if (session && res && session.accessToken) {
    res.writeHead(302, {
      Location: '/',
    })
    res.end()
    return
  }

  return {
    session: undefined,
    providers: await providers(context),
  }
}

export default SignIn
