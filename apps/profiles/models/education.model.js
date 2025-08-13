import mongoose from "mongoose";

const eduSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"Profile"
    },
    institute: {
      type: String,
      required: true,
    },
    course: {
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
    grade: {
        type: String
    }
  },
  {
    timestamps: true,
  }
);

const Education = mongoose.model("Education", eduSchema);
export default Education;
