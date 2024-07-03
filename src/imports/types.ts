import * as Sportmonks from "../sportmonks/types"
import * as SportmonksApi from "../sportmonks/api"
import TypeModel from "../models/type"
import { mapType } from "../mappers"
import { initializeCollection, upsertCollection } from "../utils/db"

export async function importTypes(init = false) {
  const sportmonkResponse = await SportmonksApi.get(
    ["core", "types"],
    new URLSearchParams({ filter: "populate", per_page: "1000" })
  )
  const sportmonkTypes = sportmonkResponse.data as Sportmonks.Type[]

  if (init) {
    await initializeCollection(TypeModel, sportmonkTypes.map(mapType))
  } else {
    await upsertCollection(TypeModel, sportmonkTypes.map(mapType))
  }
}
