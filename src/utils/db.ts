import mongoose from "mongoose"

export async function initializeCollection<ModelType>(
  model: mongoose.Model<any>,
  inputDocuments: ModelType[]
) {
  await model.deleteMany({})
  await model.insertMany(inputDocuments)
}

export async function upsertCollection<ModelType extends { _id: number }>(
  model: mongoose.Model<any>,
  inputDocuments: ModelType[]
) {
  await model.bulkWrite(
    inputDocuments.map((inputDocument) => ({
      updateOne: {
        filter: { _id: inputDocument._id },
        update: inputDocument,
        upsert: true,
      },
    }))
  )
}
