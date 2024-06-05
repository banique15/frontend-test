import { z } from "zod";
import { CartResult, ProductResult } from "./schemas";
import { config } from "./config";
import {
  ProductsQuery,
  ProductByHandleQuery,
  CreateCartMutation,
  AddCartLinesMutation,
  GetCartQuery,
  RemoveCartLinesMutation,
  ProductRecommendationsQuery,
  SearchProductsQuery,
  AccessToken,
  CreateCustomer,
  GetEvents,
  GetCustomerInfo,
  GetCustomerInfoByToken
} from "./graphql";

// Make a request to Shopify's GraphQL API  and return the data object from the response body as JSON data.
const makeShopifyRequest = async (
  query: string,
  variables: Record<string, unknown> = {},
  buyerIP: string = "",
  admin: Boolean = false
) => {
  const isSSR = import.meta.env.SSR;
  const StoreFrontapiUrl = `https://${config.shopifyShop}/api/${config.apiVersion}/graphql.json`;
  const adminAPIUrl = `https://${config.shopifyShop}/admin/api/${config.apiVersion}/graphql.json`;
  let apiUrl = "";
  
  function getOptions() {
    // If the request is made from the server, we need to pass the private access token and the buyer IP
    isSSR &&
      !buyerIP &&
      console.error(
        `🔴 No buyer IP provided => make sure to pass the buyer IP when making a server side Shopify request.`
      );

    const { privateShopifyAccessToken, publicShopifyAccessToken, adminShopifyAccessToken } = config;
    const options = {
      method: "POST",
      headers: {},
      body: JSON.stringify({ query, variables }),
    };
    // Check if the Shopify request is made from the server or the client
    
    if(admin==false){
      if (isSSR) {
        options.headers = {
          "Content-Type": "application/json",
          "Shopify-Storefront-Private-Token": privateShopifyAccessToken,
          "Shopify-Storefront-Buyer-IP": buyerIP,
        };
      }
      options.headers = {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": publicShopifyAccessToken,
      };
    }else{
      options.headers = {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminShopifyAccessToken,
      };
    }
    return options;
  }

  if(admin==false){
    apiUrl = StoreFrontapiUrl;
  }else{
    apiUrl = adminAPIUrl;
  }

  const response = await fetch(apiUrl, getOptions());
  
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${body}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: Error) => e.message).join("\n"));
  }

  return json.data;
};

// Get all products or a limited number of products (default: 10)
export const getProducts = async (options: {
  limit?: number;
  buyerIP: string;
}) => {
  const { limit = 10, buyerIP } = options;

  const data = await makeShopifyRequest(
    ProductsQuery,
    { first: limit },
    buyerIP
  );
  const { products } = data;

  if (!products) {
    throw new Error("No products found");
  }

  const productsList = products.edges.map((edge: any) => edge.node);
  const ProductsResult = z.array(ProductResult);
  const parsedProducts = ProductsResult.parse(productsList);

  return parsedProducts;
};

// Get a product by its handle (slug)
export const getProductByHandle = async (options: {
  handle: string;
  buyerIP?: string;
}) => {
  const { handle, buyerIP } = options;

  const data = await makeShopifyRequest(
    ProductByHandleQuery,
    { handle },
    buyerIP
  );
  const { product } = data;

  const parsedProduct = ProductResult.parse(product);

  return parsedProduct;
};

export const getProductRecommendations = async (options: {
  productId: string;
  buyerIP: string;
}) => {
  const { productId, buyerIP } = options;
  const data = await makeShopifyRequest(
    ProductRecommendationsQuery,
    {
      productId,
    },
    buyerIP
  );
  const { productRecommendations } = data;

  const ProductsResult = z.array(ProductResult);
  const parsedProducts = ProductsResult.parse(productRecommendations);

  return parsedProducts;
};

// Create a cart and add a line item to it and return the cart object
export const createCart = async (id: string, quantity: number) => {
  const data = await makeShopifyRequest(CreateCartMutation, { id, quantity });
  const { cartCreate } = data;
  const { cart } = cartCreate;
  const parsedCart = CartResult.parse(cart);

  return parsedCart;
};

// Add a line item to an existing cart (by ID) and return the updated cart object
export const addCartLines = async (
  id: string,
  merchandiseId: string,
  quantity: number
) => {
  const data = await makeShopifyRequest(AddCartLinesMutation, {
    cartId: id,
    merchandiseId,
    quantity,
  });
  const { cartLinesAdd } = data;
  const { cart } = cartLinesAdd;

  const parsedCart = CartResult.parse(cart);

  return parsedCart;
};

// Remove line items from an existing cart (by IDs) and return the updated cart object
export const removeCartLines = async (id: string, lineIds: string[]) => {
  const data = await makeShopifyRequest(RemoveCartLinesMutation, {
    cartId: id,
    lineIds,
  });
  const { cartLinesRemove } = data;
  const { cart } = cartLinesRemove;
  const parsedCart = CartResult.parse(cart);

  return parsedCart;
};

// Get a cart by its ID and return the cart object
export const getCart = async (id: string) => {
  const data = await makeShopifyRequest(GetCartQuery, { id });

  const { cart } = data;
  const parsedCart = CartResult.parse(cart);

  return parsedCart;
};

// Add new customer to Shopify
export const addCustomer = async (options:{email: string, password: string}) => {
  
  const {email, password} = options;

  const data = await makeShopifyRequest(CreateCustomer, { 
    email: email, 
    password: password, 
  });

  return data;
};

// Add login customer to Shopify
export const loginCustomer = async (options:{email: string, password: string}) => {
  const {email, password} = options;

  const data = await makeShopifyRequest(AccessToken, { 
    email: email, 
    password: password, 
  });

  return data;
};

// Add login customer to Shopify
export const orderEvents = async (options:{order_id: string, limit: int}) => {
  const {order_id, limit} = options;

  const data = await makeShopifyRequest(GetEvents, { 
    order_id: order_id, 
    limit: limit, 
  },"",true);

  return data;
};

// Get Customer Info
export const customerInfo = async (options:{customer_id: string, line_item_limit: int, event_limit: int}) => {
  const {customer_id, line_item_limit, event_limit} = options;

  const data = await makeShopifyRequest(GetCustomerInfo, { 
    customer_id: customer_id, 
    line_item_limit: line_item_limit, 
    event_limit: event_limit
  },"",true);

  return data;
};

// Get Customer Info By Token
export const customerInfoByToken = async (options:{token: string}) => {
  const {token} = options;
  const data = await makeShopifyRequest(GetCustomerInfoByToken, { 
    token: token
  });

  return data;
};

export const searchProducts = async (options: {  
  query: string;  
  limit?: number;  
  buyerIP: string;  
  sort_by: string;  
}) => {  
  const { query, limit=10,  buyerIP, sort_by } = options;  
  let sortkey = 'ID';  
  let reverse = false;  

  if(sort_by.search("title")>=0){  
    sortkey = 'TITLE';  
    if(sort_by.search("descending")>=0){  
        reverse = true;  
    }  
  }else if(sort_by.search("price")>=0){  
    sortkey = 'PRICE';  
    if(sort_by.search("descending")>=0){  
        reverse = true;  
    }  
  }else if(sort_by.search("created")>=0){  
    sortkey = 'CREATED_AT';  
    if(sort_by.search("descending")>=0){  
        reverse = true;  
    }  
  }else if(sort_by.search("best-selling")>=0){  
    sortkey = 'BEST_SELLING';  
  }  
  try {  
    const data = await makeShopifyRequest(  
      SearchProductsQuery,  
      { query: query, first: limit, sortkey: sortkey, reverse: reverse },  
      buyerIP,  
    );  
    const { products } = data;  
    if (!products) {  
      throw new Error("No products found");  
    }  
    const productsList = products.edges.map((edge: any) => edge.node);  
    const ProductsResult = z.array(ProductResult);  
    const parsedProducts = ProductsResult.parse(productsList);  
    return parsedProducts;  
  } catch (error) {  
    console.error("Error searching products:", error);  
    throw error;  
  }  
};  