const { Schema, model } = require("mongoose");

const sellerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, "Email is required."]
    },
    affiliation: {
      type: String,
      trim: true
    },
    listedClaims: [
      {
        type: Schema.Types.ObjectId,
        ref: "Claim"
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Seller = model("Seller", sellerSchema);

module.exports = Seller;
