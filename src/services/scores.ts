import { groupBy } from "lodash"
import DraftModel from "../models/draft"
import EventModel from "../models/event"
import * as Model from "../models/types"
import * as EventIds from "../utils/event-ids"
import * as Rb from "../types/rb"

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
): Rb.Event {
  const { team, oponentTeam } = extractTeams(event)
  return {
    name: eventName,
    minute: event.minute,
    extraMinute: event.extraMinute,
    player: {
      id: player._id,
      displayName: player.displayName,
      imagePath: player.imagePath,
      jerseyNumber: player.jerseyNumber,
      position: player.position.name,
      detailedPosition: player.detailedPosition.name,
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

function computeScores(drafts: Model.Draft[], rbEvents: Rb.Event[]) {
  const eventsByUser = groupBy(rbEvents, (rbEvent) => {
    const draft = drafts.find((draft) =>
      draft.players.includes(rbEvent.player.id)
    )
    return draft !== undefined ? draft.user : "none"
  })

  return eventsByUser
}

function extractRbEvents(events: Model.PopulatedEvent[]) {
  const relevantEventIds = [
    EventIds.GOAL,
    // EventIds.SUBSTITUTION, // TODO: Include once we handle clean sheets
    EventIds.YELLOW_CARD,
    EventIds.RED_CARD,
    EventIds.YELLOW_RED_CARD,
  ]

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

export async function getScores() {
  const events = await getAllEvents()
  const drafts = await getDrafts()

  const rbEvents = extractRbEvents(events)

  return computeScores(drafts, rbEvents)
}
