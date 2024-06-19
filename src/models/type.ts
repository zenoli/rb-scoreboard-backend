import mongoose, { InferRawDocType } from "mongoose"
const { Schema, model } = mongoose

const schemaDefinition = {
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  developerName: { type: String },
  modelType: { type: String },
  statGroup: { type: String },
}

const TypeModel = model("Type", new Schema(schemaDefinition))

export type Type = InferRawDocType<typeof schemaDefinition>
export default TypeModel
