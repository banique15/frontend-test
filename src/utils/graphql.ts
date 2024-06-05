const CART_FRAGMENT = `#graphql
fragment cartFragment on Cart {
  id
  totalQuantity
  checkoutUrl
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 100) {
    nodes {
      id
      quantity
      merchandise {
        ...on ProductVariant {
          id
          title
          image {
            url
            altText
            width
            height
          }
          product {
            handle
            title
          }
        }
      }
      cost {
        amountPerQuantity{
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
    }
  }
}
`;

const PRODUCT_FRAGMENT = `#graphql
fragment productFragment on Product {
  id
  title
  handle
  images (first: 10) {
    nodes {
      url
      width
      height
      altText
    }
  }
  variants(first: 10) {
    nodes {
      id
      title
      availableForSale
      quantityAvailable
      price {
        amount
        currencyCode
      }
    }
  }
  featuredImage {
    url
    width
    height
    altText
  }
}
`;

export const ProductsQuery = `#graphql
query ($first: Int!) {
    products(first: $first) {
      edges {
        node {
          ...productFragment
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const ProductByHandleQuery = `#graphql
  query ($handle: String!) {
    product(handle: $handle) {
      ...productFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const ProductRecommendationsQuery = `#graphql
  query ($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...productFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const GetCartQuery = `#graphql
  query ($id: ID!) {
    cart(id: $id) {
      ...cartFragment
    }
  }
  ${CART_FRAGMENT}
`;

export const CreateCartMutation = `#graphql
  mutation ($id: ID!, $quantity: Int!) {
    cartCreate (input: { lines: [{ merchandiseId: $id, quantity: $quantity }] }) {
      cart {
        ...cartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const AddCartLinesMutation = `#graphql
  mutation ($cartId: ID!, $merchandiseId: ID!, $quantity: Int) {
    cartLinesAdd (cartId: $cartId, lines: [{ merchandiseId: $merchandiseId, quantity: $quantity }]) {
      cart {
        ...cartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const RemoveCartLinesMutation = `#graphql
  mutation ($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove (cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...cartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const SearchProductsQuery = `#graphql
  query($query: String!, $first: Int!, $reverse: Boolean!, $sortkey: ProductSortKeys!) {
    products(query: $query, reverse: $reverse, first: $first, sortKey:$sortkey) {
      edges {
        node {
          ...productFragment
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const AccessToken = `#graphql
  mutation ($email:String!, $password:String!) {
    customerAccessTokenCreate(input: {
      email: $email,
      password: $password
    }){
      customerAccessToken {
        accessToken
        expiresAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CreateCustomer = `#graphql
  mutation ($email: String!, $password: String!) { 
    customerCreate(
    input: { 
        email: $email, 
        password: $password 
      }) 
        { 
        customer { id } 
        userErrors { field message } 
      }
  }
`;

export const GetEvents = `query($order_id:ID!,$limit:Int!){
  order(
    id: $order_id
  ) {
    events(first: $limit) {
      nodes {
        message
        ... on BasicEvent {
          id
          createdAt
        }
        appTitle
      }
    }
  }
}`;


export const GetCustomerInfo = `query($customer_id:ID!,$line_item_limit:Int!,$event_limit:Int!){
    customer(id: $customer_id) {
      orders(first: 10) {
        nodes {
          createdAt
          lineItems(first: $line_item_limit) {
            nodes {
              name
              sku
              quantity
              product {
                description
              }
            }
          }
          totalPrice
          events(first: $event_limit) {
            nodes {
              message
              id
              createdAt
            }
          }
          displayFinancialStatus
          displayFulfillmentStatus
          id
        }
      }
      displayName
      email
      addresses {
        country
        zip
        province
        city
        address1
      }
    }
}`;

export const GetCustomerInfoByToken = `query($token:String!) {
  customer(customerAccessToken:$token) {
    id
    firstName
    lastName                   
  }
}`;

