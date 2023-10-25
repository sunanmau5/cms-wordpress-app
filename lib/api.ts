const API_URL = process.env.WORDPRESS_API_URL;

async function fetchAPI(query = "", { variables }: Record<string, any> = {}) {
  const headers = { "Content-Type": "application/json" };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      "Authorization"
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  // WPGraphQL Plugin must be enabled
  const res = await fetch(API_URL, {
    headers,
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch API");
  }
  return json.data;
}

export async function getPreviewPost(id, idType = "DATABASE_ID") {
  const data = await fetchAPI(
    `
    query PreviewPost($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        databaseId
        slug
        status
      }
    }`,
    {
      variables: { id, idType },
    },
  );
  return data.post;
}

export async function getAllPostsForPortfolio(preview) {
  const data = await fetchAPI(
    `
    query AllPostsForPortfolio {
      posts(
        first: 20
        where: {categoryName: "portfolio", orderby: {field: DATE, order: DESC}}
      ) {
        edges {
          node {
            title
            excerpt
            slug
            content
          }
        }
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    },
  );

  return data?.posts;
}

export async function getAllPostsForOtherWorks(preview) {
  const data = await fetchAPI(
    `
    query AllPostsForOtherWorks {
      posts(
        first: 20
        where: {categoryName: "other-works", orderby: {field: DATE, order: DESC}}
      ) {
        edges {
          node {
            title
            excerpt
            slug
            content
          }
        }
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    },
  );

  return data?.posts;
}

export async function getPage(slug) {
  const data = await fetchAPI(
    `
    query PageBySlug($id: ID!, $idType: PageIdType!) {
      page(id: $id, idType: $idType) {
        title
        slug
        content
      }
    }
  `,
    {
      variables: {
        id: `/${slug}/`,
        idType: "URI",
      },
    },
  );

  return data?.page;
}

export async function getAllPagesWithSlug() {
  const data = await fetchAPI(
    `
    query AllPagesWithDatabaseID {
      pages(first: 20) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `,
  );

  return data?.pages;
}
