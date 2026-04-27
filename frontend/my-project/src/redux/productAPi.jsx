import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["product"],
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
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useSubmitReviewMutation,
  useCanUserReviewQuery,
} = productApi;
