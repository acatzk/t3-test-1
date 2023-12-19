import dayjs from 'dayjs'
import Head from 'next/head'
import { ReactNode } from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function ProfilePage() {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div>Profile View</div>
      </Layout>
    </>
  )
}

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <main className="relative flex h-full justify-center">
      <div className="mx-auto w-full border-x border-slate-400 md:max-w-2xl">{children}</div>
    </main>
  )
}