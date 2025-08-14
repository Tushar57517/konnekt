import mongoose from "mongoose";

const cerSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Profile"
    },
    name: {
      type: String,
      required: true,
    },
    org: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expDate: {
      type: Date,
      required: true,
    },
    credId: {
        type: String,
    },
    credUrl: {
        type: String,
        // required: true
    }
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model("Certificate", cerSchema);
export default Certificate;
