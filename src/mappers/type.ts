import * as Sportmonks from "../types/sportmonks"
import { camelCase, mapKeys, omit } from "lodash"

export function mapType(type: Sportmonks.Type) {
  return {
    _id: type.id,
    ...omit(
      mapKeys(type, (v, k) => camelCase(k)),
      ["id"]
    ),
  }
}
