import { useSession } from 'next-auth/client'
import Layout from '../assets/components/Layout'
import Main from '../assets/components/Main'
export default function Home() {
  const [session] = useSession()

  if (!session) {
    return (
      <Layout>
        <main>
          {/* <img
            src="https://res.cloudinary.com/cub95/image/upload/v1618796401/solen-feyissa-6MaaSBw0saw-unsplash_1_or8tmk.jpg"
            className="bg-center bg-no-repeat bg-cover h-screen w-screen"
          ></img> */}
          <div className="bg-indigo-50 h-screen w-screen">
            <div className="text-center py-72 text-6xl text-blue-900 text-opacity-80">SpotifyMe</div>
          </div>
        </main>
      </Layout>
    )
  } else {
    return (
      <Layout>
        <Main />
      </Layout>
    )
  }
}
