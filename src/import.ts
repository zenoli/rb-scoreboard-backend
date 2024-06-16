import mongoose from "mongoose"
import * as SportMonks from "./services/sportmonks.service"
import { SmTeam, SmType } from "./types/sportmonks"
import SportmonksType from "./models/SportmonksType"
import { toModel } from "./utils"
import { mapPlayer, mapTeam } from "./mappers/team.mapper"
import { flatMap } from "lodash"
import PlayerModel from "./models/player"

export async function importSportmonkTypes() {
  const sportmonkResponse = await SportMonks.get(
    ["core", "types"],
    new URLSearchParams({ filter: "populate", per_page: "1000" })
  )
  await mongoose.connect(process.env.MONGO_URL || "", {
    dbName: "euro-2024",
  })

  const sportmonkTypes = sportmonkResponse.data as SmType[]

  console.log(sportmonkTypes[0])
  console.log(toModel(sportmonkTypes[0]))

  await SportmonksType.bulkWrite(
    sportmonkTypes.map((input) => ({
      updateOne: {
        filter: { _id: input.id },
        update: toModel(input),
        upsert: true,
      },
    }))
  )
}

export async function importTeams() {
  const seasonId = process.env.SEASON_ID || ""
  const sportmonkResponse = await SportMonks.get(
    ["football", "teams", "seasons", seasonId],
    new URLSearchParams({ include: "players.player" })
  )
  await mongoose.connect(process.env.MONGO_URL || "", {
    dbName: "euro-2024",
  })

  const teams = sportmonkResponse.data as SmTeam[]

  const teamPlayers = flatMap(teams, (team) => team.players)

  console.log(teamPlayers[0])
  console.log(mapPlayer(teamPlayers[0]))

  await PlayerModel.bulkWrite(
    teamPlayers.map((input) => ({
      updateOne: {
        filter: { _id: input.player_id },
        update: mapPlayer(input),
        upsert: true,
      },
    }))
  )
}

export async function importTeams2() {
  const seasonId = process.env.SEASON_ID || ""
  const teams = await SportMonks.get(
    ["football", "teams", "seasons", seasonId],
    new URLSearchParams({ include: "players.player" })
  )

  console.log(teams)
  await mongoose.connect(process.env.MONGO_URL || "", {
    dbName: "euro-2024",
  })
}
