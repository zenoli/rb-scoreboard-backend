import { flatMap, groupBy, intersection, mapValues, omit, sum } from "lodash"
import removeAccents from "remove-accents"
import CleanSheetModel from "../models/clean-sheet"
import { getPopulatedDrafts } from "./drafts"
import * as Model from "../models/types"
import * as TypeIds from "../utils/type-ids"
import * as Rb from "../types/rb"
import { mapPlayer, mapTeam } from "./utils"
import { getPopulatedPlayers } from "./players"

async function getUefaCleanSheets(): Promise<Model.CleanSheet[]> {
  return await CleanSheetModel.find({}).exec()
}

function getMatchingCleanSheetsEvents(
  goalKeepers: Model.PopulatedPlayer[],
  uefaCleanSheets: Model.CleanSheet[]
): Rb.CleanSheetEvent[] {
  const draftedGoalKeeperNames = flatMap(goalKeepers, (goalKeeper) => [
    // Hopefully one of these three values matches with the Uefa names
    removeAccents(goalKeeper.displayName),
    removeAccents(goalKeeper.name),
    removeAccents(goalKeeper.commonName),
  ])

  // Dictionary: name -> cleanSheetEvent
  const matchingUefaCleanSheetsDict = mapValues(
    groupBy(
      uefaCleanSheets.filter((cleanSheetEvent) =>
        draftedGoalKeeperNames.includes(removeAccents(cleanSheetEvent.name))
      ),
      (cleanSheetEvent) => removeAccents(cleanSheetEvent.name)
    ),
    (events) => events[0]
  )
  let outputs: Rb.CleanSheetEvent[] = []

  for (const goalKeeper of goalKeepers) {
    const cleanSheetEvent =
      matchingUefaCleanSheetsDict[removeAccents(goalKeeper.displayName)] ||
      matchingUefaCleanSheetsDict[removeAccents(goalKeeper.name)] ||
      matchingUefaCleanSheetsDict[removeAccents(goalKeeper.commonName)]

    if (cleanSheetEvent) {
      outputs.push({
        name: "cleanSheet",
        player: mapPlayer(goalKeeper),
        team: mapTeam(goalKeeper.team),
        cleanSheets: cleanSheetEvent.cleanSheets,
      })
    }
  }
  return outputs
}

export async function getPlayerToCleanSheetsMap(): Promise<
  Record<string, Rb.CleanSheetEvent[]>
> {
  const [uefaCleanSheets, players] = await Promise.all([
    getUefaCleanSheets(),
    getPopulatedPlayers(),
  ])

  const goalKeepers = players.filter(
    (player) => player.position._id === TypeIds.GOALKEEPER
  )

  const result = goalKeepers.map((goalKeeper) => {
    const cleanSheetEvents = getMatchingCleanSheetsEvents(
      [goalKeeper],
      uefaCleanSheets
    )
    return [goalKeeper._id, cleanSheetEvents]
  })

  return Object.fromEntries(result)
}

export async function getUsersToCleanSheetsMap(): Promise<
  Record<string, Rb.CleanSheetEvent[]>
> {
  const [uefaCleanSheets, drafts] = await Promise.all([
    getUefaCleanSheets(),
    getPopulatedDrafts(),
  ])
  const result = drafts.map((draft) => {
    const goalKeepers = draft.players.filter(
      (player) => player.position._id === TypeIds.GOALKEEPER
    )
    const cleanSheetEvents = getMatchingCleanSheetsEvents(
      goalKeepers,
      uefaCleanSheets
    )
    return [draft.user, cleanSheetEvents]
  })

  return Object.fromEntries(result)
}

export async function getCleanSheetsOfUser(user: string) {
  const userToEventsMap = await getUsersToCleanSheetsMap()
  if (!Object.keys(userToEventsMap).includes(user)) {
    throw new Error(`Unknown user ${user}`)
  }
  return userToEventsMap[user]
}
