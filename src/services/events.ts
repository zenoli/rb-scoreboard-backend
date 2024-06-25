import EventModel from "../models/event"
import * as Model from "../models/types"
import * as TypeIds from "../utils/type-ids"
import * as Rb from "../types/rb"
import { getDrafts } from "./drafts"
import { mapPlayer, mapTeam } from "./utils"
import { groupBy, omit } from "lodash"

async function getPopulatedEvents({
  playerIds,
  eventTypeIds,
}: {
  playerIds?: number[]
  eventTypeIds: number[]
}): Promise<Model.PopulatedEvent[]> {
  return await EventModel.find(playerIds ? { player: { $in: playerIds } } : {})
    .find(eventTypeIds ? { type: { $in: eventTypeIds } } : {})
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
    player: mapPlayer(player),
    team: mapTeam(team),
    oponentTeam: mapTeam(oponentTeam),
  }
}

function computeUserToEventsMap(drafts: Model.Draft[], rbEvents: Rb.Event[]) {
  return omit(
    groupBy(rbEvents, (rbEvent) => {
      const draft = drafts.find((draft) =>
        draft.players.includes(rbEvent.player.id)
      )
      return draft !== undefined ? draft.user : "none"
    }),
    ["none"]
  )
}

function computeScoreEvents(events: Model.PopulatedEvent[]) {
  const relevantEvents = events.filter(
    (event) => event.player !== null // Yellow cards by coaches don't resolve to a player
  )

  const goalWithAssistEvents = events.filter(
    (event) => event.type._id === TypeIds.GOAL && event.relatedPlayer !== null
  )

  const rbEvents = [
    ...relevantEvents.map(extractEvent),
    ...goalWithAssistEvents.map(extractAssistEvent),
  ]
  return rbEvents
}

export async function getUserToEventsMap() {
  const relevantEventIds = [
    TypeIds.GOAL,
    TypeIds.PENALTY,
    TypeIds.YELLOW_CARD,
    TypeIds.RED_CARD,
    TypeIds.YELLOW_RED_CARD,
  ]
  const [events, drafts] = await Promise.all([
    getPopulatedEvents({ eventTypeIds: relevantEventIds }),
    getDrafts(),
  ])

  const rbEvents = computeScoreEvents(events)
  const userToEventsMap = computeUserToEventsMap(drafts, rbEvents)
  return userToEventsMap
}

export async function getEventsOfUser(user: string) {
  const userToEventsMap = await getUserToEventsMap()
  if (!Object.keys(userToEventsMap).includes(user)) {
    throw new Error(`Unknown user ${user}`)
  }
  return userToEventsMap[user]
}
