import mongoose from "mongoose"
import * as SportMonks from "./services/sportmonks.service"
import { SmType } from "./types/sportmonks"
import SportmonksType from "./models/SportmonksType"
import { toModel } from "./utils"

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
  const teams = await SportMonks.get(
    ["football", "teams", "seasons", seasonId],
    new URLSearchParams({ include: "players.player" })
  )

  console.log(teams)
  await mongoose.connect(process.env.MONGO_URL || "", {
    dbName: "euro-2024",
  })
}
