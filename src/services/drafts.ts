import { capitalize } from "lodash"
import DraftModel from "../models/draft"
import * as Model from "../models/types"

export async function getDrafts(): Promise<Model.Draft[]> {
  return await DraftModel.find({}).exec()
}

export async function getPopulatedDrafts(): Promise<Model.PopulatedDraft[]> {
  return await DraftModel.find({})
    .populate<Model.PopulatedDraft>({
      path: "players",
      populate: ["position", "team"],
    })
    .exec()
}

export async function getPopulatedDraftsOfUser(
  user: string
): Promise<Model.PopulatedDraft[]> {
  return await DraftModel.find({ user: capitalize(user) })
    .populate<Model.PopulatedDraft>({
      path: "players",
      populate: ["position", "team"],
    })
    .exec()
}
