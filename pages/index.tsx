import Layout from 'assets/components/Layout'
import Main from 'assets/components/Main'
import { useSession } from 'next-auth/client'
export default function Home() {
  const [session, loading] = useSession()

  if (!session) {
    return (
      <Layout>
        <main>
          <img
            src="https://res.cloudinary.com/cub95/image/upload/v1618796401/solen-feyissa-6MaaSBw0saw-unsplash_1_or8tmk.jpg"
            className="bg-center bg-no-repeat bg-cover h-screen w-screen"
          ></img>
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
