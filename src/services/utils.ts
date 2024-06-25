import * as Model from "../models/types"
import * as Rb from "../types/rb"

export function mapPlayer(player: Model.PopulatedPlayer): Rb.Player {
  return {
    id: player._id,
    displayName: player.displayName,
    imagePath: player.imagePath,
    jerseyNumber: player.jerseyNumber,
    position: player.position.name,
    detailedPosition: player.detailedPosition.name,
  }
}

export function mapTeam(team: Model.PopulatedTeam): Rb.Team {
  return {
    name: team.name,
    shortCode: team.shortCode,
    imagePath: team.imagePath,
  }
}
