import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
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
        /^[a-z]+\d+@my\.sliit\.lk$/,
        "Email must be a valid SLIIT student email (e.g., it23296664@my.sliit.lk)"
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
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [16, "Age must be above 16"]
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
    emergencyContact: {
      type: String,
      required: [true, "Emergency contact is required"],
      match: [/^07\d{8}$/, "Emergency contact must be 10 digits and start with 07"]
    },
    role: {
      type: String,
      default: "STUDENT",
      enum: {
        values: ["STUDENT"],
        message: "Role must be STUDENT"
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

studentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

studentSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Student", studentSchema);
