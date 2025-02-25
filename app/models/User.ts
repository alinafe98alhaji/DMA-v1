import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hasCompletedAssessment: { type: Boolean, default: false },
  responses: { type: Object, default: {} } // Store assessment responses
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
