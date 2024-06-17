import mongoose from "mongoose"
const { Schema, model } = mongoose

const DraftModel = model(
  "Draft",
  new Schema({
    _id: { type: Number, required: true },
    user: { type: String, required: true },
    players: [{ type: Number, ref: "Player" }],
  })
)

export default DraftModel
