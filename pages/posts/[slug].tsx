import { GetStaticPaths, GetStaticProps } from "next"
import ErrorPage from "next/error"
import Head from "next/head"
import { useRouter } from "next/router"
import Container from "../../components/container"
import Header from "../../components/header"
import Layout from "../../components/layout"
import PostBody from "../../components/post-body"
import PostHeader from "../../components/post-header"
import PostTitle from "../../components/post-title"
import { getAllPostsWithSlug, getPostAndMorePosts } from "../../lib/api"

export default function Post({ post }) {
  const router = useRouter()

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <article>
            <Head>
              <title>{`${post.title} | RINA WOLF`}</title>
            </Head>
            <PostHeader title={post.title} />
            <PostBody content={post.content} />
          </article>
        )}
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData
}) => {
  const data = await getPostAndMorePosts(params?.slug, preview, previewData)

  return {
    props: {
      preview,
      post: data.post,
      posts: data.posts
    },
    revalidate: 10
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getAllPostsWithSlug()

  return {
    paths: allPosts.edges.map(({ node }) => `/posts/${node.slug}`) || [],
    fallback: true
  }
}
