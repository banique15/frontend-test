import { z } from "zod";
export const configSchema = z.object({
  shopifyShop: z.string(),
  publicShopifyAccessToken: z.string(),
  privateShopifyAccessToken: z.string(),
  adminShopifyAccessToken: z.string().optional(), // Make it optional
  apiVersion: z.string(),
});
export const MoneyV2Result = z.object({
  amount: z.string(),
  currencyCode: z.string(),
});
export const ImageResult = z
  .object({
    altText: z.string().nullable().optional(),
    url: z.string(),
    width: z.number().positive().int(),
    height: z.number().positive().int(),
  })
  .nullable();
export const CartItemResult = z.object({
  id: z.string(),
  cost: z.object({
    amountPerQuantity: MoneyV2Result,
    subtotalAmount: MoneyV2Result,
    totalAmount: MoneyV2Result,
  }),
  merchandise: z.object({
    id: z.string(),
    title: z.string(),
    product: z.object({
      title: z.string(),
      handle: z.string(),
    }),
    image: ImageResult.nullable(),
  }),
  quantity: z.number().positive().int(),
});
export const CartResult = z
  .object({
    id: z.string(),
    cost: z.object({
      subtotalAmount: MoneyV2Result,
    }),
    checkoutUrl: z.string(),
    totalQuantity: z.number().int(),
    lines: z.object({
      nodes: z.array(CartItemResult),
    }),
  })
  .nullable();
export const VariantResult = z.object({
  id: z.string(),
  title: z.string(),
  availableForSale: z.boolean(),
  quantityAvailable: z.number().int(),
  price: MoneyV2Result,
});
export const ProductResult = z
  .object({
    id: z.string(),
    title: z.string(),
    handle: z.string(),
    images: z.object({
      nodes: z.array(ImageResult),
    }),
    variants: z.object({
      nodes: z.array(VariantResult),
    }),
    featuredImage: ImageResult.nullable(),
  })
  .nullable();
  // ...
export const AddressResult = z.object({
  id: z.number(),
  address1: z.string().nullable(),
  city: z.string().nullable(),
  province: z.string().nullable(),
  zip: z.string().nullable(),
  country: z.string().nullable(),
  // Add other address-related fields as necessary
});

export const CustomerResult = z.object({
  id: z.number(),
  email: z.string().email().nullable(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  addresses: z.array(AddressResult).optional(),
  // Include other fields as necessary
});

export const OrderResult = z.object({
  id: z.number(),
  email: z.string().email().nullable(),
  created_at: z.string().nullable(),
  total_price: z.string().nullable(),
  fulfillment_status: z.string().nullable(),
  financial_status: z.string().nullable(),
  // Add other order-related fields as necessary
});

export const EventResult = z.object({
  type: z.string().optional(), // Make 'type' optional
  message: z.string().optional(), // Make 'message' optional
  created_at: z.string(), // 'created_at' is still required
});