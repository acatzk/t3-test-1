import React from 'react'
import Head from 'next/head'

type Props = {}

const SinglePostPage = (props: Props): JSX.Element => {
  return (
    <div>
      <Head>
        <title>Post</title>
        <meta name="description" content="💭" />
      </Head>
      <main>Post</main>
    </div>
  )
}

export default SinglePostPage
