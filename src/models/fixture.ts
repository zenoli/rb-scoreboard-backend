import mongoose, { InferRawDocType } from "mongoose"
const { Schema, model } = mongoose

const schemaDefinition = {
  _id: { type: Number, required: true },
  sportId: { type: Number, required: true },
  leagueId: { type: Number, required: true },
  seasonId: { type: Number, required: true },
  stageId: { type: Number, required: true },
  groupId: { type: Number },
  aggregateId: { type: Number },
  roundId: { type: Number },
  stateId: { type: Number, required: true },
  venueId: { type: Number, required: true },
  name: { type: String, required: true },
  startingAt: { type: Date },
  resultInfo: { type: String },
  leg: { type: String },
  details: { type: String, required: true },
  length: { type: Number, required: true },
  placeholder: { type: Boolean },
  hasOdds: { type: Boolean },
  hasPremiumOdds: { type: Boolean },
  startingAtTimestamp: { type: Number, required: true },
  events: [{ type: Number, ref: "Event" }],
  participants: [{ type: Number, ref: "Team" }],
}

const FixtureModel = model("Fixture", new Schema(schemaDefinition))

export type Fixture = InferRawDocType<typeof schemaDefinition>
export default FixtureModel
