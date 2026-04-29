import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["product", "AdminProducts", "Reviews"],
  keepUnusedDataFor: 30, //cache data 30 second in memory
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params: {
          page: params?.page,
          keyword: params?.keyword,
          ratings: params?.ratings,
          category: params?.category,
          "price[gte]": params.min,
          "price[lte]": params.max,
        },
      }),
    }),
    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ["product"],
    }),
    submitReview: builder.mutation({
      query(body) {
        return {
          url: "/reviews",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["product"],
    }),

    canUserReview: builder.query({
      query: (productId) => `/can-review/?productId=${productId}`,
    }),

    getAdminProducts: builder.query({
      query: () => `/admin/products`,
      providesTags: ["AdminProducts"],
    }),

    createProduct: builder.mutation({
      query(body) {
        return {
          url: "/admin/products",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["AdminProducts"],
    }),
    updateProduct: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/products/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["AdminProducts", "product"],
    }),
    uploadProductImages: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/products/${id}/upload-images`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["product"],
    }),

    deleteProductImage: builder.mutation({
      query({ id, imgId }) {
        return {
          url: `/admin/products/${id}/delete-image`,
          method: "PUT",
          body: { imgId },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["product"],
    }),

    deleteProduct: builder.mutation({
      query(id) {
        return {
          url: `/admin/products/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AdminProducts"],
    }),
    getProductReviews: builder.query({
      query: (productId) => `/admin/reviews?id=${productId}`,
      providesTags: ["Reviews"],
    }),
    deleteProductReviews: builder.mutation({
      query({ productId, id }) {
        return {
          url: `/admin/reviews?productId=${productId}&id=${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useSubmitReviewMutation,
  useCanUserReviewQuery,
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImagesMutation,
  useDeleteProductImageMutation,
  useDeleteProductMutation,
  useLazyGetProductReviewsQuery,
  useDeleteProductReviewsMutation,
} = productApi;
