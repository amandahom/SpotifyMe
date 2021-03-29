import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import fetch from 'node-fetch'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req })
    let accessToken =
      session && session.user && session.user.accessToken && session.user.accessToken ? session.user.accessToken : ''

    const ENDPOINT = `https://api.spotify.com/v1/me`

    // const response = await fetch(ENDPOINT, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // })

    const getData = async () => {
      const userInfo = await fetch(ENDPOINT, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const userDataRes = await userInfo.json()
      // console.log('userData;', userDataRes)
      if (userDataRes) {
        return res.status(200).json(userDataRes)
      } else {
        return new Error('No user found')
      }
    }

    return getData()
  } catch (err) {
    console.log(err)
    return res.status(400)
  }
}
