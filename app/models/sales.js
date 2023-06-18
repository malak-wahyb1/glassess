import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const saleSchema = new mongoose.Schema(
  {
    type: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "ProductInfo",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
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
    const products = this.products;
    const ProductInfo = mongoose.model("ProductInfo");

    for (const product of products) {
      const { product: productId, quantity } = product;
      await ProductInfo.findByIdAndUpdate(productId, { $inc: { quantity: -quantity } });
    }

    next();
  } catch (error) {
    next(error);
  }
});

saleSchema.pre(["find", "findOne"], function () {
  this.populate(["products.product", "customer", "type"]);
});

saleSchema.plugin(mongoosePaginate);

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
