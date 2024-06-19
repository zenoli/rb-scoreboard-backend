import mongoose, { InferRawDocType } from "mongoose"
const { Schema, model } = mongoose

const schemaDefinition = {
  _id: { type: Number, required: true },
  sportId: { type: Number, required: true },
  countryId: { type: Number },
  venueId: { type: Number },
  gender: { type: String, required: true },
  name: { type: String, required: true },
  shortCode: { type: String, required: true },
  imagePath: { type: String, required: true },
  founded: { type: Number },
  type: { type: String, required: true },
  placeholder: { type: Boolean, default: false },
  lastPlayedAt: { type: Date },
  players: [{ type: Number, ref: "Player" }],
}

const TeamModel = model("Team", new Schema(schemaDefinition))

export type Team = InferRawDocType<typeof schemaDefinition>
export default TeamModel
