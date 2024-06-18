import mongoose from "mongoose"
const { Schema, model } = mongoose

const sportmonksTypeSchema = new Schema({
  _id: Number,
  name: String,
  code: String,
  developerName: String,
  modelType: String,
  statGroup: String,
})

const TypeModel = model("SportmonksType", sportmonksTypeSchema)
export default TypeModel
