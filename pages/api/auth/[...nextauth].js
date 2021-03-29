import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default (req, res) =>
  NextAuth(req, res, {
    providers: [
      Providers.Spotify({
        scope:
          'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-read-currently-playing user-top-read playlist-modify-public playlist-modify-private',
        clientId:
          process && process.env && process.env.SPOTIFY_CLIENT_ID ? process.env.SPOTIFY_CLIENT_ID.toString() : '',
        clientSecret:
          process && process.env && process.env.SPOTIFY_CLIENT_SECRET
            ? process.env.SPOTIFY_CLIENT_SECRET.toString()
            : '',
      }),
    ],
    callbacks: {
      async jwt(token, user, account, profile, isNewUser) {
        if (account) {
          token.id = account.id
          token.accessToken = account.accessToken
          console.log(token.accessToken)
        }
        return token
      },
      async session(session, user) {
        session.user = user
        // console.log(session)
        return session
      },
    },
    secret: process.env.SECRET,
    debug: true,
  })
