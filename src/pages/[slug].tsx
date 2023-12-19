import Head from 'next/head'
import { ReactNode } from 'react'

import { api } from '~/utils/api'

const ProfilePage = (): JSX.Element => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username: 'acatzk'
  })

  if (isLoading) return <div>Loading...</div>

  if (!data) return <div>404</div>

  console.log(data)

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Layout>
        <div>{data.username}</div>
      </Layout>
    </>
  )
}

export default ProfilePage

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <main className="relative flex h-full justify-center">
      <div className="mx-auto w-full border-x border-slate-400 md:max-w-2xl">{children}</div>
    </main>
  )
}
