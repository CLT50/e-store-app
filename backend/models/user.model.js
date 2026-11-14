import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
	role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true }
);


// 1. Define pre-save hook BEFORE creating the model
// ***Mongoose 9+ the traditional next() callback parameter 
// was completely removed from middleware hooks. 
// Pre-save and other document hooks no longer accept a 
// next parameter.

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   try {
//      //***If this runs in Mongoose 9, "next" is undefined or a document object!
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next(); //***Throws: "next is not a function"
//   } catch (error) {
//     next(error);
//   }
// });


userSchema.pre("save", async function () {
	// 1. Early return if the password hasn't changed
	if (!this.isModified("password")) return;

	// 2. Hash the password safely using async/await
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});



// 2. Define schema methods BEFORE creating the model
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// 3. Compile the model LAST
const User = mongoose.model("User", userSchema);

export default User;








      



	











      



	