export type User = "Olivier" | "Fabian" | "Jakob" | "Joel" | "Chris" | "Jan"

export interface Event {
  name: string
  minute: number
  extraMinute: number | undefined
  player: Player
  team: Team
  oponentTeam: Team
}

export type CleanSheetEvent = Omit<
  Event,
  "minute" | "extraMinute" | "oponentTeam"
> & {
  cleanSheets: number
}

export interface Team {
  name: string
  shortCode: string
  imagePath: string
}

export interface Player {
  id: number
  displayName: string
  imagePath: string
  jerseyNumber: number | undefined
  team?: Team
  position: string
  detailedPosition: string | undefined
}

export type ScoreType = "goal" | "assist" | "booking" | "cleanSheet" | "total"

export type Score = {
  [key in ScoreType]: number
}
