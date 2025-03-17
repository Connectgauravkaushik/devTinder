const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt"); // bcrypt to encrypt the pswrd
const jwt = require("jsonwebtoken");

//simply use this to create schema
// we will add some strict checks for field validations
const userSchema = new mongoose.Schema(
  {
    // here we will pass all the parameter which define user.
    firstName: {
      type: String,
      required: true, // make sure this field is mandatory.
      unique: true,
      minlength: 4,
      maxlength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Ensures uniqueness of email
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address !");
        }
      },
      lowercase: true, // Ensures email is stored in lowercase
      trim: true, // Removes any leading/trailing spaces
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong password !");
        }
      },
    },
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [100, "Age cannot exceed 100"],
    },
    gender: {
      type: String,

      // We create enum when we want the user to restrict from some values like status should of only 4 types
      enum: {
        values: ["male", "female", "other"],
        message: "${Value} is incorrect status type",
      },

      isPremium: {
        type: Boolean,
        default: false,
      },

      membershipType: {
        type: String,

      }
      //validation in build
      // validate(value) {
      //   if (!["male", "female", "other"].includes(value)) {
      //     throw new Error("Gender data is not valid");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL !", value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default description of the new user !",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

//HELPER METHOD
userSchema.methods.getJWT = async function () {
  const user = this; // referencing to the current instance or user / using this;
  const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$79g=G", {
    expiresIn: "1d",
  }); // creating a JWT TOKEN
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

//Now we create a mongoose model , model is a class create it's own instances when a new user comes
// this model help in creating the new users.

const User = mongoose.model("user", userSchema);
module.exports = User;
