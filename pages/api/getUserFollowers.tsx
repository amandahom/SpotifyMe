import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import fetch from 'node-fetch'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req })
    let accessToken =
      session && session.user && session.user.accessToken && session.user.accessToken ? session.user.accessToken : ''

    const ENDPOINT = `https://api.spotify.com/v1/me/following?type=artist&limit=50`

    const getFollowers = async () => {
      const followersInfo = await fetch(ENDPOINT, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const items = await followersInfo.json()
      console.log('followerData', followersInfo)
      // const users = Object.entries(items).map((followers: any) => ({
      //   url: followers.external_urls.spotify,
      //   fans: followers.followers.total,
      //   genres: followers.genres,
      //   href: followers.href,
      //   images: followers.images,
      //   name: followers.name,
      //   popularity: followers.popularity,
      // }))

      console.log(items)

      if (items) {
        return res.status(200).json(items)
      }
    }

    return getFollowers()
  } catch (err) {
    console.log(err)
    return res.status(400)
  }
}
