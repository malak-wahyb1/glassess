import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const saleSchema = new mongoose.Schema(
  {
    discount: {
      type: Number,
      default:0,
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
          default: 1,
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
      await ProductInfo.findByIdAndUpdate(productId, {
        $inc: { quantity: -quantity },
      });
    }

    next();
  } catch (error) {
    next(error);
  }
});

saleSchema.pre(["find", "findOne"], function (next) {
  this.populate("products.product");
  this.populate("customer");
  next();
});

saleSchema.plugin(mongoosePaginate);

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
