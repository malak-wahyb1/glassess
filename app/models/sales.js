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

saleSchema.pre("save", async function (next) {
  try {
    const products = this.products;
    const ProductInfo = mongoose.model("ProductInfo");

    // Check if each product barcode exists in the ProductInfo schema
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const existingProduct = await ProductInfo.findOne({
        bar_code: product.barcode,
      });

      if (!existingProduct) {
        // Barcode does not exist, remove the product from the array
        products.splice(i, 1);
        i--; // Adjust the index since we removed an element
      } else {
        // Barcode exists, update the product_id with the matched product's _id
        products[i].product_id = existingProduct._id;
      }
    }

    // If any product is left in the array, update the quantity of existing products
    if (products.length > 0) {
      for (const product of products) {
        const { barcode, quantity } = product;
        await ProductInfo.findOneAndUpdate(
          { bar_code: barcode },
          { $inc: { quantity: -quantity } }
        );
      }

      next();
    } else {
      // No valid products, don't create the sale
      throw new Error("No valid products found");
    }
  } catch (error) {
    next(error);
  }
});

saleSchema.pre(["find", "findOne"], function (next) {
  this.populate(
    "products.product_id"
   );
  this.populate("customer");
  next();
});

saleSchema.plugin(mongoosePaginate);

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
