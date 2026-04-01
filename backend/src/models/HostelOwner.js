import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const hostelOwnerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [30, "First name must be less than 30 characters"],
      match: [/^[A-Za-z]+$/, "First name must contain letters only"]
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [30, "Last name must be less than 30 characters"],
      match: [/^[A-Za-z]+$/, "Last name must contain letters only"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address"
      ]
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^07\d{8}$/, "Phone number must be 10 digits and start with 07"]
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Gender must be Male, Female, or Other"
      }
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      validate: {
        validator(value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()\-+=])[A-Za-z\d@$!%*?&_#^()\-+=]{8,}$/.test(
            value
          );
        },
        message:
          "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
      },
      select: false
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"]
    },
    role: {
      type: String,
      default: "HOSTELOWNER",
      enum: {
        values: ["HOSTELOWNER"],
        message: "Role must be HOSTELOWNER"
      }
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

hostelOwnerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

hostelOwnerSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("HostelOwner", hostelOwnerSchema);
