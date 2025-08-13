import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    banner: {
      type: String,
    },
    pfp: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    link: {
      type: String,
    },
    location: {
      type: String,
      // required: true,
    },
    about: {
      type: String,
    },
    experience: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Experience",
    },
    education: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Education",
    },
    Certificates: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Certificate",
    },
    skills: {
      type: [String],
    },
    languages: {
      type: [String],
    },
    connectionCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
