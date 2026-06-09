
import mongoose from "mongoose";
import { IUser } from "./user.model";

export interface IProduct {
  _id?: mongoose.Types.ObjectId;

  title: string;
  description: string;
  price: number;

  stock: number;
  isStockAvailable?: boolean;
  vendor:IUser;

  image1: string;
  image2?: string;
  image3?: string;

  category: string;

  isWearable: boolean;
  size?: string[];

  verificationStatus: "pending" | "approved" | "rejected";
  requestedAt: Date;
  approvedAt?: Date;
  rejectedReason?: string;

  isActive?: boolean;

  replacementDays?: number;
  freeDelivery?: boolean;
  warranty?: string;
  payOnDelivery?: boolean;

  detailsPoints: string[];

  reviews?: {
    user: IUser;
    rating: number;
    comment?: string;
    image?: string;
    createdAt?: Date;
  }[];

  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    isStockAvailable: {
      type: Boolean,
      default: function () {
        return this.stock > 0;
      },
    },
    vendor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },

    image1: {
      type: String,
      required: true,
    },

    image2: String,
    image3: String,

    category: {
      type: String,
      required: true,
    },

    isWearable: {
      type: Boolean,
      default: false,
    },

    size: 
      {
        type: [String],
        default:[]

      },
    

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: Date,

    rejectedReason: String,

    isActive: {
      type: Boolean,
      default: false,
    },

    replacementDays: Number,
    freeDelivery: {
      type: Boolean,
      default: false,
    },

    warranty: {
     type:String,
     default:"No Warranty"
    },

    payOnDelivery: {
      type: Boolean,
      default: false,
    },

    detailsPoints: [
      {
        type: String,
      },
    ],

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        comment: String,
        image: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Product= mongoose.models.Product ||
  mongoose.model<IProduct>("Product", productSchema);
  export default Product;