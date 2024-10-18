const API_URL = process.env.WORDPRESS_API_URL;

async function fetchAPI(query = "", { variables }: Record<string, any> = {}) {
  const headers = {
    "Content-Type": "application/json",
    origin: "https://rina-wolf.com",
  };

  // if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
  //   headers["Authorization"] =
  //     `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  // }

  // WPGraphQL Plugin must be enabled
  const res = await fetch(
    API_URL ?? "https://admin.rina-wolf.com/wordpress/graphql",
    {
      next: { revalidate: 10 },
      headers,
      method: "POST",
      body: JSON.stringify({
        query,
        variables,
      }),
    },
  );

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch API");
  }
  return json.data;
}

export async function getAllPostsForPortfolio() {
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
  );

  return data?.posts;
}

export async function getAllPostsForOtherWorks() {
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

export async function getMainUser() {
  const data = await fetchAPI(
    `
    query getMainUser {
      user(id: "dXNlcjox") {
        id
        name
        avatar {
          url
        }
      }
    }
  `,
  );

  return data?.user;
}
