import dayjs from 'dayjs'
import Head from 'next/head'
import Image from 'next/image'
import { ReactNode, useState } from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
import { SignInButton, useUser } from '@clerk/nextjs'

import { api } from '~/utils/api'
import { Spinner } from '~/components/spinner'
import type { RouterOutputs } from '~/utils/api'
import { toast } from 'sonner'
import Link from 'next/link'

dayjs.extend(relativeTime)

const CreatePostWizard = () => {
  const { user } = useUser()
  const [input, setInput] = useState<string>('')

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput('')
      void ctx.posts.getAll.invalidate()
      toast.success('Saved')
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0])
      } else {
        toast.error('Failed to post! Please try again later.')
      }
    }
  })

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
        value={input}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()

            if (input !== '') {
              mutate({
                content: input
              })
            }
          }
        }}
        onChange={(e) => setInput(e.target.value)}
      />
      {input !== '' && !isPosting && (
        <button
          onClick={() => {
            mutate({
              content: input
            })
          }}
        >
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex scale-50 items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  )
}

type PostViewProps = RouterOutputs['posts']['getAll'][number]

const PostView = (props: PostViewProps): JSX.Element => {
  const { post, author } = props

  return (
    <div key={post.id} className="flex gap-x-3 p-4">
      <Image
        width={56}
        height={56}
        src={author.profilePicture}
        alt={`${author.username}'s profile picture`}
        className="h-14 w-14 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex gap-x-1 text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <span>&bull;</span>
          <Link href={`/@${author.username}`}>
            <span>{dayjs(post.createdAt).fromNow()}</span>
          </Link>
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
    <div className="flex flex-col  divide-y divide-slate-400 ">
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
        <title>Chirp</title>
        <meta name="description" content="💭" />
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
    <main className="relative flex h-full justify-center">
      <div className="mx-auto w-full border-x border-slate-400 md:max-w-2xl">{children}</div>
    </main>
  )
}
