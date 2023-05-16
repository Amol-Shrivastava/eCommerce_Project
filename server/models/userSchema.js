const { mongoose, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is compulsory"],
      maxLength: [32, "Name string cannot be more than 32 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is compulsory"],
      unique: [true, "Email cannot be duplicate"],
      validate: [validateEmail, "Please enter a valid email address"],
    },
    number: {
      type: Number,
      min: [6, "Minimum phone number is of 6 digits"],
      max: [12, "Maximum phone number can be 10 digits"],
      default: 0000000000,
    },
    passwords: {
      type: String,
      trim: true,
      required: [true, "Password cannot be blank"],
      minLength: [5, "Passwords have atleast 5 characters"],
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments", default: [] }],
    orders: [{ type: Schema.Types.ObjectId, ref: "Orders", default: [] }],
    cartItems: [{ type: Schema.Types.ObjectId, ref: "Product", default: [] }],
    address: [{ type: Schema.Types.ObjectId, ref: "Address", required: true }],
    productsList: [
      { type: Schema.Types.ObjectId, ref: "Products", default: [] },
    ],
  },
  { timestamps: true }
);

function validateEmail(email) {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
}

module.exports = mongoose.model("Users", userSchema);
