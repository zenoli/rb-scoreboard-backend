import * as Model from "../models/types"
import PlayerModel from "../models/player"

export async function getPlayers(): Promise<Model.Player[]> {
  return await PlayerModel.find<Model.Player>({}).exec()
}

export async function getPopulatedPlayers(): Promise<Model.PopulatedPlayer[]> {
  return await PlayerModel.find({})
    .populate<Model.PopulatedPlayer>(["position", "team"])
    .exec()
}
