import * as Sportmonks from "../types/sportmonks"
import { camelCase, mapKeys, omit } from "lodash"

export function mapPlayer(teamPlayer: Sportmonks.TeamPlayer) {
  const smPlayer = teamPlayer.player
  const mappedPlayer = {
    _id: smPlayer.id,
    ...omit(
      mapKeys(smPlayer, (v, k) => camelCase(k)),
      ["id", "type_id", "position_id", "detailed_position_id"]
    ),
  }
  const mappedTeamPlayer = {
    teamPlayerId: teamPlayer.id,
    team: teamPlayer.team_id,
    position: teamPlayer.position_id,
    detailedPosition: teamPlayer.detailed_position_id,
    ...omit(
      mapKeys(smPlayer, (v, k) => camelCase(k)),
      ["id", "team_id", "position_id", "detailed_position_id"]
    ),
  }

  return { ...mappedPlayer, ...mappedTeamPlayer }
}
