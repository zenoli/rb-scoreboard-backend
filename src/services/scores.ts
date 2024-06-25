import { groupBy, mapValues, sum } from "lodash"
import * as Rb from "../types/rb"
import { getCleanSheetEvents } from "./clean-sheets"
import { getScoreEvents } from "./events"

function computeScores(
  eventsByUser: Record<string, Rb.Event[]>,
  cleanSheetEventsByUser: Record<string, Rb.CleanSheetEvent[]>
): Record<string, Rb.Score> {
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

  const allEventScores = Object.fromEntries(
    Object.entries(eventScores).map(([user, score]) => [
      user,
      { ...score, cleanSheet: cleanSheetScores[user] },
    ])
  )

  const defaultScore: Rb.Score = {
    goal: 0,
    assist: 0,
    cleanSheet: 0,
    booking: 0,
    total: 0,
  }

  return mapValues(allEventScores, (score) => ({
    ...defaultScore,
    ...score,
    total: sum(Object.values(score)),
  }))
}

export async function getScores() {
  const [eventsByUser, cleanSheetEventsByUser] = await Promise.all([
    getScoreEvents(),
    getCleanSheetEvents(),
  ])
  // return cleanSheetEventsByUser
  return computeScores(eventsByUser, cleanSheetEventsByUser)
}
