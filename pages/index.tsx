import { GetStaticProps } from "next"
import Head from "next/head"
import Container from "../components/container"
import Intro from "../components/intro"
import Layout from "../components/layout"
import SinglePost from "../components/single-post"
import { getAllPostsForHome } from "../lib/api"

export default function Index({ allPosts: { edges } }) {
  return (
    <Layout>
      <Head>
        <title>RINA WOLF</title>
      </Head>
      <Container>
        <Intro />
        {edges.length > 0 ? (
          <>
            {edges.map(({ node }) => (
              <SinglePost post={node} />
            ))}
          </>
        ) : null}
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview)

  return {
    props: { allPosts, preview },
    revalidate: 10
  }
}
