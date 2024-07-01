import * as Sportmonks from "../sportmonks/types"
import * as SportmonksApi from "../sportmonks/api"
import { mapPlayer, mapTeam } from "../mappers"
import { flatMap } from "lodash"
import PlayerModel from "../models/player"
import TeamModel from "../models/team"
import { updateCollection } from "../utils/db"

export async function importTeams() {
  const seasonId = process.env.SEASON_ID || "22842"
  const sportmonkResponse = await SportmonksApi.get(
    ["football", "teams", "seasons", seasonId],
    new URLSearchParams({ include: "players.player" })
  )

  const teams = sportmonkResponse.data as Sportmonks.Team[]
  const nationalTeams = teams.filter((team) => team.type === "national")
  const teamPlayers = flatMap(nationalTeams, (team) => team.players)

  await Promise.all([
    updateCollection(TeamModel, nationalTeams.map(mapTeam)),
    updateCollection(PlayerModel, teamPlayers.map(mapPlayer)),
  ])
}
