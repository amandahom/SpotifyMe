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
            src="https://res.cloudinary.com/cub95/image/upload/v1617593447/vishnu-r-nair-m1WZS5ye404-unsplash_1_csz562.jpg"
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
