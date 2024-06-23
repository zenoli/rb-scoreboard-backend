import { Draft } from "./draft"
import { Event } from "./event"
import { Fixture } from "./fixture"
import { Player } from "./player"
import { Type } from "./type"
import { Team } from "./team"

export { Draft } from "./draft"
export { Event } from "./event"
export { Fixture } from "./fixture"
export { Player } from "./player"
export { Type } from "./type"
export { Team } from "./team"
export { CleanSheet } from "./clean-sheet"

export type PopulatedDraft = Omit<Draft, "players"> & {
  players: PopulatedPlayer[]
}

export type PopulatedEvent = Omit<
  Event,
  "fixture" | "participant" | "type" | "player" | "relatedPlayer"
> & {
  fixture: PopulatedFixture
  participant: PopulatedTeam
  type: Type
  player?: PopulatedPlayer
  relatedPlayer?: PopulatedPlayer
}
export type PopulatedFixture = Omit<Fixture, "events" | "participants"> & {
  events: PopulatedEvent[]
  participants: PopulatedTeam[]
}

export type PopulatedPlayer = Omit<
  Player,
  "team" | "position" | "detailedPosition"
> & {
  team: PopulatedTeam
  position: Type
  detailedPosition: Type
}

export type PopulatedTeam = Omit<Team, "players"> & {
  players: PopulatedPlayer[]
}
