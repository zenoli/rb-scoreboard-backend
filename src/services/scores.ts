import { groupBy, mapValues, omit, sum } from "lodash"
import removeAccents from "remove-accents"
import DraftModel from "../models/draft"
import EventModel from "../models/event"
import * as Model from "../models/types"
import * as TypeIds from "../utils/type-ids"
import * as Rb from "../types/rb"
import CleanSheetModel from "../models/clean-sheet"

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

async function getPopulatedDrafts(): Promise<Model.PopulatedDraft[]> {
  return await DraftModel.find({})
    .populate<Model.PopulatedDraft>({
      path: "players",
      populate: ["position", "team"],
    })
    .exec()
}

async function getCleanSheets(): Promise<Model.CleanSheet[]> {
  return await CleanSheetModel.find({}).exec()
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

function mapPlayer(player: Model.PopulatedPlayer) {
  return {
    id: player._id,
    displayName: player.displayName,
    imagePath: player.imagePath,
    jerseyNumber: player.jerseyNumber,
    position: player.position.name,
    detailedPosition: player.detailedPosition.name,
  }
}

function mapTeam(team: Model.PopulatedTeam) {
  return {
    name: team.name,
    shortCode: team.shortCode,
    imagePath: team.imagePath,
  }
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

function getEventsByUsers(drafts: Model.Draft[], rbEvents: Rb.Event[]) {
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

function computeScores(
  eventsByUser: Record<string, Rb.Event[]>,
  cleanSheetEventsByUser: Record<string, Rb.CleanSheetEvent[]>
) {
  function toScoreType(eventName: string): Rb.ScoreType {
    if (eventName === "Goal" || eventName === "Penalty") return "goal"
    if (eventName === "Assist") return "assist"
    else return "booking"
  }

  const eventScores = mapValues(eventsByUser, (events) =>
    mapValues(
      groupBy(events, (event) => toScoreType(event.name)),
      (events) => events.length
    )
  ) as Record<string, Rb.Score>

  const cleanSheetScores = mapValues(
    cleanSheetEventsByUser,
    (cleanSheetEvents) =>
      sum(cleanSheetEvents.map((event) => event.cleanSheets))
  )

  return Object.fromEntries(
    Object.entries(eventScores).map(([user, score]) => [
      user,
      { cleanSheets: cleanSheetScores[user], ...score },
    ])
  )

  return Object.keys(eventScores)
  // const eventScores = mapValues(eventScores, (score) => ({
  //   ...score,
  //   total: sum(Object.values(score)),
  // }))
}

function extractRbEvents(events: Model.PopulatedEvent[]) {
  const relevantEventIds = [
    TypeIds.GOAL,
    TypeIds.PENALTY,
    // EventIds.SUBSTITUTION, // TODO: Include once we handle clean sheets
    TypeIds.YELLOW_CARD,
    TypeIds.RED_CARD,
    TypeIds.YELLOW_RED_CARD,
  ]

  const relevantEvents = events.filter(
    (event) =>
      relevantEventIds.includes(event.type._id) && event.player !== null // Yellow cards by coaches don't resolve to a player
  )

  const { goalWithAssistEvents, nonGoalEvents } = groupBy(events, (event) =>
    event.type._id === TypeIds.GOAL && event.relatedPlayer !== null
      ? "goalWithAssistEvents"
      : "nonGoalEvents"
  )

  const rbEvents = [
    ...relevantEvents.map(extractEvent),
    ...goalWithAssistEvents.map(extractAssistEvent),
  ]
  return rbEvents
}

function getCleanSheetEvents(
  drafts: Model.PopulatedDraft[],
  cleanSheetEvents: Model.CleanSheet[]
): Record<string, Rb.CleanSheetEvent[]> {
  const result = drafts.map((draft) => {
    const goalKeepers = draft.players.filter(
      (player) => player.position._id === TypeIds.GOALKEEPER
    )

    const userCleanSheetEvents = mapValues(
      groupBy(
        cleanSheetEvents.filter((cleanSheetEvent) =>
          goalKeepers
            .map((goalKeeper) => removeAccents(goalKeeper.displayName))
            .includes(removeAccents(cleanSheetEvent.name))
        ),
        (cleanSheetEvent) => removeAccents(cleanSheetEvent.name)
      ),
      (events) => events[0]
    )

    let outputs: Rb.CleanSheetEvent[] = []

    for (const goalKeeper of goalKeepers) {
      const cleanSheetEvent =
        userCleanSheetEvents[removeAccents(goalKeeper.displayName)]

      if (cleanSheetEvent) {
        outputs.push({
          name: "cleanSheet",
          player: mapPlayer(goalKeeper),
          team: mapTeam(goalKeeper.team),
          cleanSheets: cleanSheetEvent.cleanSheets,
        })
      }
    }
    return [draft.user, outputs]
  })

  return Object.fromEntries(result)
}

export async function getScores() {
  const { eventsByUser, cleanSheetEventsByUser } = await getScoreEvents()
  const events = await getAllEvents()
  return computeScores(eventsByUser, cleanSheetEventsByUser)
}

export async function getScoreEvents() {
  const events = await getAllEvents()
  const cleanSheets = await getCleanSheets()
  const drafts = await getDrafts()
  const populatedDrafts = await getPopulatedDrafts()

  const rbEvents = extractRbEvents(events)
  const eventsByUser = getEventsByUsers(drafts, rbEvents)
  const cleanSheetEventsByUser = getCleanSheetEvents(
    populatedDrafts,
    cleanSheets
  )

  return { eventsByUser, cleanSheetEventsByUser }
}
