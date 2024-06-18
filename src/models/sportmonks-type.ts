import mongoose, { InferRawDocType } from "mongoose"
const { Schema, model } = mongoose

const schemaDefinition = {
  _id: Number,
  name: String,
  code: String,
  developerName: String,
  modelType: String,
  statGroup: String,
}

const TypeModel = model("Type", new Schema(schemaDefinition))

export type Type = InferRawDocType<typeof schemaDefinition>
export default TypeModel
