import { camelCase, mapKeys, omit } from "lodash"

export function toModel(input: object) {
  return mapKeys(input, (v, k) => (k === "id" ? "_id" : camelCase(k)))
}
