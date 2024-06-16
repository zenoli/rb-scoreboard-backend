import { SmTeam, SmTeamPlayer } from "../types/sportmonks"
import { camelCase, mapKeys, omit } from "lodash"

export function mapTeam(smTeam: SmTeam) {
  return {
    _id: smTeam.id,
    players: smTeam.players.map((player) => player.player_id),
    ...omit(
      mapKeys(smTeam, (v, k) => camelCase(k)),
      ["id", "players"]
    ),
  }
}

export function mapPlayer(smTeamPlayer: SmTeamPlayer) {
  const smPlayer = smTeamPlayer.player
  const mappedPlayer = {
    _id: smPlayer.id,
    ...omit(
      mapKeys(smPlayer, (v, k) => camelCase(k)),
      ["id", "type_id", "position_id", "detailed_position_id"]
    ),
  }
  const mappedTeamPlayer = {
    teamPlayerId: smTeamPlayer.id,
    team: smTeamPlayer.team_id,
    position: smTeamPlayer.position_id,
    detailedPosition: smTeamPlayer.detailed_position_id,
    ...omit(
      mapKeys(smPlayer, (v, k) => camelCase(k)),
      ["id", "team_id", "position_id", "detailed_position_id"]
    ),
  }

  return { ...mappedPlayer, ...mappedTeamPlayer }
}
