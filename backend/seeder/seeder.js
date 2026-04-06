import mongoose from "mongoose";
import Product from "../model/products.js";
import products from "../seeder/data.js";
const seedProducts = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://susheel2me:Bibha12345@graphqlcluster.uwajt9f.mongodb.net/shopit",
    );

    await Product.deleteMany();
    console.log("Products are deleted");

    await Product.insertMany(products);
    console.log("Product is inserted");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit;
  }
};

seedProducts();
