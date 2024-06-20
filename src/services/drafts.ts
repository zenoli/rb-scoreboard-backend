import DraftModel from "../models/draft"
import * as Model from "../models/types"

export async function getDrafts(): Promise<Model.PopulatedDraft[]> {
  return await DraftModel.find({})
    .populate<Model.PopulatedDraft>({ path: "players", populate: "team" })
    .exec()
}
