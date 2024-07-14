import { groupBy, mapValues, sum } from "lodash"
import * as Rb from "../types/rb"
import {
  getPlayerToCleanSheetsMap,
  getUsersToCleanSheetsMap,
} from "./clean-sheets"
import { getPlayerToEventsMap, getUserToEventsMap } from "./events"
import { getPopulatedPlayers } from "./players"

function computeScores(
  userToEventMap: Record<string, Rb.Event[]>,
  userToCleanSheetsMap: Record<string, Rb.CleanSheetEvent[]>
): Record<string, Rb.Score> {
  function toScoreType(eventName: string): Rb.ScoreType {
    if (eventName === "Goal" || eventName === "Penalty") return "goal"
    if (eventName === "Assist") return "assist"
    else return "booking"
  }

  const eventScores = mapValues(userToEventMap, (events) =>
    mapValues(
      groupBy(events, (event) => toScoreType(event.name)),
      (events) => events.length
    )
  ) as Record<string, Rb.Score>

  const cleanSheetScores = mapValues(userToCleanSheetsMap, (cleanSheetEvents) =>
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
  const [userToEventsMap, userToCleanSheetsMap] = await Promise.all([
    getUserToEventsMap(),
    getUsersToCleanSheetsMap(),
  ])
  const userToScoreMap = computeScores(userToEventsMap, userToCleanSheetsMap)
  return Object.entries(userToScoreMap).map(([user, score]) => ({
    user,
    ...score,
  }))
}

export async function getPlayerScores() {
  const [playerToEventsMap, playerToCleanSheetsMap, players] =
    await Promise.all([
      getPlayerToEventsMap(),
      getPlayerToCleanSheetsMap(),
      getPopulatedPlayers(),
    ])
  const playerToScoreMap = computeScores(
    playerToEventsMap,
    playerToCleanSheetsMap
  )
  const playerScores = players.map((player) => {
    if (player._id in playerToScoreMap) {
      return { player: player, ...playerToScoreMap[player._id] }
    } else {
      return {
        player: player,
        goal: 0,
        assist: 0,
        booking: 0,
        cleanSheet: 0,
        total: 0,
      }
    }
  })
  return playerScores
}
