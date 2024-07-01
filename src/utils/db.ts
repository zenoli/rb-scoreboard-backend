import mongoose from "mongoose"

export async function updateCollection<ModelType>(
  model: mongoose.Model<any>,
  inputDocuments: ModelType[]
) {
  await model.deleteMany({})
  await model.insertMany(inputDocuments)
}
