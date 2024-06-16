import * as SportMonks from "../services/sportmonks-api"
import { SmType } from "../types/sportmonks"
import SportmonksType from "../models/sportmonks-type"
import { toModel } from "../utils"

export async function importSportmonkTypes() {
  const sportmonkResponse = await SportMonks.get(
    ["core", "types"],
    new URLSearchParams({ filter: "populate", per_page: "1000" })
  )

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
