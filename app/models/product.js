import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import ProductInfo from "./productInfo.js";
const productSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
);

productSchema.pre("findOneAndDelete", async function (next) {
  try {
    await ProductInfo.deleteOne({ product: this._id }); 
    next();
  } catch (error) {
    next(error);
  }
});

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model("Product", productSchema);
export default Product;
