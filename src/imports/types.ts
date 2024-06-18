import * as Sportmonks from "../types/sportmonks"
import * as SportmonksApi from "../services/sportmonks-api"
import TypeModel from "../models/sportmonks-type"
import { mapType } from "../mappers"

export async function importTypes() {
  const sportmonkResponse = await SportmonksApi.get(
    ["core", "types"],
    new URLSearchParams({ filter: "populate", per_page: "1000" })
  )

  const sportmonkTypes = sportmonkResponse.data as Sportmonks.Type[]

  await TypeModel.bulkWrite(
    sportmonkTypes.map((type) => ({
      updateOne: {
        filter: { _id: type.id },
        update: mapType(type),
        upsert: true,
      },
    }))
  )
}
