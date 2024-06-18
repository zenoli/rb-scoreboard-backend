import mongoose, { InferRawDocType } from "mongoose"
const { Schema, model } = mongoose

const schemaDefinition = {
  _id: { type: Number, required: true },
  user: { type: String, required: true },
  players: [{ type: Number, ref: "Player" }],
}

const DraftModel = model("Draft", new Schema(schemaDefinition))

export type Draft = InferRawDocType<typeof schemaDefinition>
export default DraftModel
