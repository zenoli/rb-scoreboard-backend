import * as Sportmonks from "../types/sportmonks"
import * as SportmonksApi from "../services/sportmonks-api"
import TypeModel from "../models/sportmonks-type"
import { toModel } from "../utils"

export async function importSportmonkTypes() {
  const sportmonkResponse = await SportmonksApi.get(
    ["core", "types"],
    new URLSearchParams({ filter: "populate", per_page: "1000" })
  )

  const sportmonkTypes = sportmonkResponse.data as Sportmonks.Type[]

  console.log(sportmonkTypes[0])
  console.log(toModel(sportmonkTypes[0]))

  await TypeModel.bulkWrite(
    sportmonkTypes.map((input) => ({
      updateOne: {
        filter: { _id: input.id },
        update: toModel(input),
        upsert: true,
      },
    }))
  )
}
