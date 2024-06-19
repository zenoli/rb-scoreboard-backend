export type User = "Olivier" | "Fabian" | "Jakob" | "Joel" | "Christian" | "Jan"

export interface Event {
  name:
    | "goal"
    | "assist"
    | "substitution"
    | "yellow-card"
    | "red-card"
    | "yellow-red-card"
  minute: number
  extraMinute: number | null
  player: Player
  team: Team
  oponentTeam: Team
}

export interface Team {
  name: string
  shortCode: string
  imagePath: string
}

export interface Player {
  displayName: string
  imagePath: string
  jerseyNumber: number
  team: Team
  position: string
  detailedPosition: string
}
