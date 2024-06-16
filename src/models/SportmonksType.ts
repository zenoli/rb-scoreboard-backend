import mongoose from "mongoose"
const { Schema, model } = mongoose

const sportmonksTypeSchema = new Schema({
  _id: Number,
  name: String,
  code: String,
  developer_name: String,
  model_type: String,
  stat_group: String,
})

const SportmonksType = model("SportmonksType", sportmonksTypeSchema)
export default SportmonksType
