// export const getPriceQueryParams = (searchParams, key, value) => {
//   const hasValueInParam = searchParams.has(key);

//   if (value && hasValueInParam) {
//     searchParams.set(key, value);
//   } else if (value) {
//     searchParams.append(key, value);
//   } else if (hasValueInParam) {
//     searchParams.delete(key);
//   }
//   return searchParams;
// };
export const getPriceQueryParams = (searchParams, key, value) => {
  if (value && value !== "0") {
    searchParams.set(key, value);
  } else {
    searchParams.delete(key);
  }
  return searchParams;
};
