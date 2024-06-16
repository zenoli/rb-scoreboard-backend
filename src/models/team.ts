import mongoose from "mongoose"
const { Schema, model } = mongoose

const TeamModel = model(
  "Team",
  new Schema({
    _id: { type: Number, required: true },
    sportId: { type: Number, required: true },
    countryId: { type: Number },
    venueId: { type: Number },
    gender: { type: String, required: true },
    name: { type: String, required: true },
    shortCode: { type: String },
    imagePath: { type: String, required: true },
    founded: { type: Number },
    type: { type: String, required: true },
    placeholder: { type: Boolean, default: false },
    lastPlayedAt: { type: Date },
    players: [{ type: Number, ref: "Player" }],
  })
)

export default TeamModel
