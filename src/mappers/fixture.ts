import * as Sportmonks from "../sportmonks/types"
import { camelCase, mapKeys, omit } from "lodash"

export function mapFixture(fixture: Sportmonks.Fixture) {
  return {
    _id: fixture.id,
    events: fixture.events.map((event) => event.id),
    participants: fixture.participants.map((participant) => participant.id),
    ...omit(
      mapKeys(fixture, (v, k) => camelCase(k)),
      ["id", "events", "participants"]
    ),
  }
}
