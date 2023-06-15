import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const saleSchema = new mongoose.Schema(
  {
    product: [{
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    }],
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
);

saleSchema.pre("save", async function (next) {
    try {
      const productIds = this.product; // Array of product IDs
      const Product = mongoose.model("Product");
  
      // Increment quantity of all associated products by 1
      await Product.updateMany(
        { _id: { $in: productIds } },
        { $inc: { quantity: -1 } }
      );
  
      next();
    } catch (error) {
      next(error);
    }
  });
saleSchema.pre(["find", "findOne"], function () {
  this.populate(["product", "customer"]);
});
saleSchema.plugin(mongoosePaginate);
const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
