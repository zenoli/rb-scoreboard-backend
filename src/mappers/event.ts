import * as Sportmonks from "../types/sportmonks"
import { camelCase, mapKeys, omit } from "lodash"

export function mapEvent(event: Sportmonks.Event) {
  return {
    _id: event.id,
    fixture: event.fixture_id,
    participant: event.participant_id,
    player: event.player_id,
    type: event.type_id,
    relatedPlayer: event.related_player_id,
    ...omit(
      mapKeys(event, (v, k) => camelCase(k)),
      [
        "id",
        "fixture_id",
        "participant_id",
        "player_id",
        "related_player_id",
        "type_id",
      ]
    ),
  }
}
