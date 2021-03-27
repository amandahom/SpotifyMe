import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import fetch from 'node-fetch'

// type Data = {
//   name: string
// }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req })
    console.log('Sessions:', session)
    let accessToken =
      session && session.user && session.user.accessToken && session.user.accessToken ? session.user.accessToken : ''

    console.log('AToken', accessToken)

    const ENDPOINT = `https://api.spotify.com/v1/me`

    const response = await fetch(ENDPOINT, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    // const getData = async () => {
    //   const userInfo = await fetch(ENDPOINT, {
    //     method: 'GET',
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   })
    const data = await response.json()
    console.log(data)

    return res.status(200).json(data)
  } catch (err) {
    console.log(err)
    return res.status(400)
  }
}
