const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_GRAPHQL_API_VERSION || '2024-01';

const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

export interface ShopifyFetchParams {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}

export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
  tags,
}: ShopifyFetchParams): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next: { tags } }),
    });

    const body = await result.json();

    if (body.errors) {
      console.error('Shopify GraphQL Errors:', body.errors);
      throw new Error(body.errors[0].message || 'Error executing Shopify GraphQL query');
    }

    if (!result.ok) {
      throw new Error(`Shopify API error: ${result.status} ${result.statusText}`);
    }

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    console.error('Error in shopifyFetch:', error);
    throw new Error(error instanceof Error ? error.message : 'Unknown error during shopifyFetch');
  }
}

export const getProductsQuery = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export const createCartMutation = `
  mutation createCart($lineItems: [CartLineInput!]) {
    cartCreate(input: { lines: $lineItems }) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                  }
                }
              }
            }
          }
        }
      }
  }
`;

export const customerAccessTokenCreateMutation = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const customerCreateMutation = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export async function createShopifyCheckout(_lineItems: { variantId: string, quantity: number }[]): Promise<string> {
  // Since we are using mock variant IDs (gid://shopify/ProductVariant/...), 
  // a real fetch would throw a GraphQL error. 
  // We simulate a 3-second network delay to test the GSAP Haki Portal sequence.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('https://checkout.shopify.com/mock-haki-drop-checkout');
    }, 3500);
  });

  /*
  // --- PRODUCTION IMPLEMENTATION ---
  const query = createCartMutation;
  const variables = {
    lineItems: lineItems.map(item => ({
      merchandiseId: item.variantId,
      quantity: item.quantity
    }))
  };

  const response = await shopifyFetch<any>({ query, variables, cache: 'no-store' });
  return response.body.data.cartCreate.cart.checkoutUrl;
  */
}
