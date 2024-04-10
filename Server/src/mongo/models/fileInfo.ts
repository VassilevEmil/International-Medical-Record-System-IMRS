import mongoose from "mongoose";

export const FileInfoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  fileHash: {
    type: String,
    required: false
  },
});
