const { Schema, model } = require("mongoose");

const buyerSchema = new Schema(
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
    }
  },
  {
    timestamps: true,
  }
);

const Buyer = model("Buyer", buyerSchema);

module.exports = Buyer;
