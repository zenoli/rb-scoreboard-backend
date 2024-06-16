import mongoose from "mongoose"
import * as SportMonks from "./services/sportmonks.service"
import { SmType } from "./types/sportmonks"
import SportmonksType from "./models/SportmonksType"
import { mapKeys } from "lodash"

export async function importSportmonkTypes() {
  const sportmonkResponse = await SportMonks.get(
    ["core", "types"],
    new URLSearchParams({ filter: "populate", per_page: "1000" })
  )
  await mongoose.connect(process.env.MONGO_URL || "", {
    dbName: "euro-2024",
  })

  const sportmonkTypes = sportmonkResponse.data as SmType[]

  await SportmonksType.bulkWrite(
    sportmonkTypes.map((input) => ({
      updateOne: {
        filter: { _id: input.id },
        update: {
          _id: input.id,
          name: input.name,
          code: input.code,
          modelType: input.model_type,
          statGroup: input.stat_group,
        },
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
