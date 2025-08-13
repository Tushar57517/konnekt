import mongoose from "mongoose";

const expSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"Profile"
    },
    jobTitle: {
      type: String,
      required: true,
    },
    org: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Experience = mongoose.model("Experience", expSchema);
export default Experience;
