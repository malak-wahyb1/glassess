import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const saleSchema = new mongoose.Schema(
  {
    discount: {
      type: Number,
      default: 0,
    },
    products: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: "ProductInfo",
        },
        barcode: {
          type: String,
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



saleSchema.pre(["find", "findOne"], function (next) {
  this.populate("products.product_id");
  this.populate("customer");
  next();
});

saleSchema.plugin(mongoosePaginate);

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
