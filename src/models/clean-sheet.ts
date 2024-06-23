import mongoose, { InferRawDocType } from "mongoose"
const { Schema, model } = mongoose

const schemaDefinition = {
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  country: { type: String, required: true },
  position: { type: String, required: true },
  cleanSheets: { type: Number, required: true },
}

const CleanSheetModel = model("CleanSheet", new Schema(schemaDefinition))

export type CleanSheet = InferRawDocType<typeof schemaDefinition>
export default CleanSheetModel
