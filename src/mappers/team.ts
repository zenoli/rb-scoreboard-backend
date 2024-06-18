import * as Sportmonks from "../types/sportmonks"
import { camelCase, mapKeys, omit } from "lodash"

export function mapTeam(team: Sportmonks.Team) {
  return {
    _id: team.id,
    players: team.players.map((player) => player.player_id),
    ...omit(
      mapKeys(team, (v, k) => camelCase(k)),
      ["id", "players"]
    ),
  }
}
