import { GetStaticProps } from "next"
import Container from "../components/container"
import Intro from "../components/intro"
import Layout from "../components/layout"
import SinglePost from "../components/single-post"
import { getAllPostsForOtherWorks } from "../lib/api"

export default function OtherWorks({ allPosts: { edges } }) {
  return (
    <Layout>
      <Container>
        <Intro />
        {edges.length > 0 ? (
          <>
            {edges.map(({ node }) => (
              //
              //
              <SinglePost key={node.id} post={node} />
            ))}
          </>
        ) : null}
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForOtherWorks(preview)

  return {
    props: { allPosts, preview },
    revalidate: 10
  }
}
