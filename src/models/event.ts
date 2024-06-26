import mongoose, { InferRawDocType } from "mongoose"
const { Schema, model } = mongoose

const schemaDefinition = {
  _id: { type: Number, required: true },
  fixture: { type: Number, ref: "Fixture" },
  periodId: { type: Number, required: true },
  participant: { type: Number, ref: "Team" },
  type: { type: Number, ref: "Type" },
  section: { type: String },
  player: { type: Number, ref: "Player" },
  relatedPlayer: { type: Number, ref: "Player" },
  playerName: { type: String, required: true },
  relatedPlayerName: { type: String },
  result: { type: String },
  info: { type: String },
  addition: { type: String },
  minute: { type: Number, required: true },
  extraMinute: { type: Number },
  injured: { type: Boolean, default: false },
  onBench: { type: Boolean, default: false },
  coachId: { type: Number },
  subTypeId: { type: Number },
}

const EventModel = model("Event", new Schema(schemaDefinition))

export type Event = InferRawDocType<typeof schemaDefinition>
export default EventModel
