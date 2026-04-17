class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  // filters() {
  //   const queryCopy = { ...this.queryStr };

  //   //Fields to remove
  //   const filedsToRemove = ["keyword", "page"];
  //   filedsToRemove.forEach((el) => delete queryCopy[el]);

  //   //Advance filter for price, ratings etc
  //   let queryStr = JSON.stringify(queryCopy);
  //   queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
  //   this.query = this.query.find(JSON.parse(queryStr));
  //   return this;
  // }

  filters() {
    const queryCopy = { ...this.queryStr };

    const fieldsToRemove = ["keyword", "page"];
    fieldsToRemove.forEach((el) => delete queryCopy[el]);

    let query = {};

    // ✅ CATEGORY
    if (queryCopy.category) {
      query.category = queryCopy.category;
    }

    // ✅ PRICE
    if (queryCopy["price[gte]"] || queryCopy["price[lte]"]) {
      query.price = {};

      if (queryCopy["price[gte]"]) {
        query.price.$gte = Number(queryCopy["price[gte]"]);
      }

      if (queryCopy["price[lte]"]) {
        query.price.$lte = Number(queryCopy["price[lte]"]);
      }
    }

    // ✅ ⭐ RATING FILTER (MAIN FIX)
    if (queryCopy.ratings) {
      query.ratings = {
        $gte: Number(queryCopy.ratings),
      };
    }

    console.log("+++++FINAL FILTER QUERY:", query);

    this.query = this.query.find(query);

    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default APIFilters;
