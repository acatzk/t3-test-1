import dayjs from 'dayjs'
import Head from 'next/head'
import Image from 'next/image'
import { ReactNode } from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
import { SignInButton, useUser } from '@clerk/nextjs'

import { api } from '~/utils/api'
import { Spinner } from '~/components/spinner'
import type { RouterOutputs } from '~/utils/api'

dayjs.extend(relativeTime)

const CreatePostWizard = () => {
  const { user } = useUser()

  if (!user) return null

  return (
    <div className="flex w-full gap-x-3">
      <Image
        width={56}
        height={56}
        src={user.profileImageUrl}
        alt={`${user.username}'s profile picture`}
        className="h-14 w-14 rounded-full"
      />
      <input
        type="text"
        placeholder="Type some emojis!"
        className="w-full bg-transparent outline-none"
      />
    </div>
  )
}

type PostViewProps = RouterOutputs['posts']['getAll'][number]

const PostView = (props: PostViewProps): JSX.Element => {
  const { post, author } = props

  return (
    <div key={post.id} className="flex gap-x-3 border-b border-slate-400 p-4">
      <Image
        width={56}
        height={56}
        src={author.profilePicture}
        alt={`${author.username}'s profile picture`}
        className="h-14 w-14 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex gap-x-1 text-slate-300">
          <span>{`@${author.username}`}</span>
          <span>&bull;</span>
          <span>{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  )
}

const Feed = () => {
  const { data, isLoading: postsLoaded, isError } = api.posts.getAll.useQuery()

  if (postsLoaded) {
    return (
      <Layout>
        <div className="fixed inset-x-0 top-24 flex h-screen w-screen justify-center py-2">
          <Spinner />
        </div>
      </Layout>
    )
  }

  if (!data) {
    return (
      <Layout>
        <div
          className="mb-4 flex items-center rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <svg
            className="me-3 inline h-4 w-4 flex-shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Alert!</span> Something went wrong!
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <div className="flex flex-col">
      {data?.map(({ ...fullPost }) => <PostView key={fullPost.post.id} {...fullPost} />)}
    </div>
  )
}

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser()

  api.posts.getAll.useQuery()

  if (!userLoaded) {
    return (
      <Layout>
        <div className="fixed inset-x-0 top-8 flex h-screen w-screen justify-center py-2">
          <Spinner />
        </div>
      </Layout>
    )
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex border-b border-slate-400 p-4">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {isSignedIn && <CreatePostWizard />}
        </div>
        <Feed />
      </Layout>
    </>
  )
}

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <main className="relative flex h-screen justify-center">
      <div className="mx-auto w-full border-x border-slate-400 md:max-w-2xl">{children}</div>
    </main>
  )
}
