import * as Sportmonks from "../sportmonks/types"
import * as SportmonksApi from "../sportmonks/api"
import TypeModel from "../models/type"
import { mapType } from "../mappers"
import { updateCollection } from "../utils/db"

export async function importTypes() {
  const sportmonkResponse = await SportmonksApi.get(
    ["core", "types"],
    new URLSearchParams({ filter: "populate", per_page: "1000" })
  )

  const sportmonkTypes = sportmonkResponse.data as Sportmonks.Type[]
  await updateCollection(TypeModel, sportmonkTypes.map(mapType))
}
