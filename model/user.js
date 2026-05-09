import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {type: String},
    email: {type: String},
    age: {type: Number},
}, {
    timestamps: true,
})

const User = mongoose.models.Users || model("Users", userSchema);
export default User;