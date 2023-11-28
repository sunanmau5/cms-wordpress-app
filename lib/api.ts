const API_URL = process.env.WORDPRESS_API_URL;

async function fetchAPI(query = "", { variables }: Record<string, any> = {}) {
  const headers = { "Content-Type": "application/json" };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      "Authorization"
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

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

export async function sendMail({ subject, body, mutationId = "contact" }) {
  const fromAddress = "noreply@rina-wolf.com";
  const toAddress = "sunan.regi+111@gmail.com";
  const data = await fetchAPI(
    `
		mutation SendEmail($input: SendEmailInput!) {
			sendEmail(input: $input) {
				message
				origin
				sent
			}
		}
	`,
    {
      variables: {
        input: {
          clientMutationId: mutationId,
          from: fromAddress,
          to: toAddress,
          subject: subject,
          body: body,
        },
      },
    },
  );

  return data?.sendEmail;
}
