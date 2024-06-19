import { groupBy } from "lodash"
import DraftModel from "../models/draft"
import EventModel from "../models/event"
import * as Model from "../models/types"
import * as EventIds from "../utils/event-ids"

async function getAllEvents(): Promise<Model.PopulatedEvent[]> {
  return await EventModel.find({})
    .select([
      "name",
      "player",
      "relatedPlayer",
      "minute",
      "extraMinute",
      "fixture",
    ])
    .populate<Model.PopulatedEvent>([
      { path: "type" },
      {
        path: "player",
        populate: ["position", "detailedPosition"],
      },
      { path: "relatedPlayer" },
      { path: "participant" },
      {
        path: "fixture",
        populate: { path: "participants" },
      },
    ])
    .exec()
}

async function getDrafts(): Promise<Model.Draft[]> {
  return await DraftModel.find({}).exec()
}

function extractTeams(event: Model.PopulatedEvent) {
  const team: Model.PopulatedTeam = event.participant
  const oponentTeam = event.fixture.participants.find(
    (participant) => participant._id != team._id
  ) as Model.PopulatedTeam
  return { team, oponentTeam }
}

function extractEvent(event: Model.PopulatedEvent) {
  return extractRbEvent(
    event,
    event.type.name,
    event.player as Model.PopulatedPlayer
  )
}

function extractAssistEvent(event: Model.PopulatedEvent) {
  return extractRbEvent(
    event,
    "Assist",
    event.relatedPlayer as Model.PopulatedPlayer
  )
}

function extractRbEvent(
  event: Model.PopulatedEvent,
  eventName: string,
  player: Model.PopulatedPlayer
) {
  const { team, oponentTeam } = extractTeams(event)
  return {
    name: eventName,
    minute: event.minute,
    extraMinute: event.extraMinute,
    player: {
      displayName: player.displayName,
      imagePath: player.imagePath,
      jerseyNumber: player.jerseyNumber,
      position: player.position.name,
      detailedPosision: player.detailedPosition.name,
    },
    team: {
      name: team.name,
      shortCode: team.shortCode,
      imagePath: team.imagePath,
    },
    oponentTeam: {
      name: oponentTeam.name,
      shortCode: oponentTeam.shortCode,
      imagePath: oponentTeam.imagePath,
    },
  }
}

export async function getScores() {
  const relevantEventIds = [
    EventIds.GOAL,
    EventIds.SUBSTITUTION,
    EventIds.YELLOW_CARD,
    EventIds.RED_CARD,
    EventIds.YELLOW_RED_CARD,
  ]

  const events = await getAllEvents()
  const drafts = await getDrafts()

  const relevantEvents = events.filter(
    (event) =>
      relevantEventIds.includes(event.type._id) && event.player !== null // Yellow cards by coaches don't resolve to a player
  )

  const { goalWithAssistEvents, nonGoalEvents } = groupBy(events, (event) =>
    event.type._id === EventIds.GOAL && event.relatedPlayer !== null
      ? "goalWithAssistEvents"
      : "nonGoalEvents"
  )

  const rbEvents = [
    ...relevantEvents.map(extractEvent),
    ...goalWithAssistEvents.map(extractAssistEvent),
  ]
  return rbEvents
}
