import { groupBy, mapValues, omit, sum } from "lodash"
import removeAccents from "remove-accents"
import CleanSheetModel from "../models/clean-sheet"
import { getPopulatedDrafts } from "./drafts"
import * as Model from "../models/types"
import * as TypeIds from "../utils/type-ids"
import * as Rb from "../types/rb"
import { mapPlayer, mapTeam } from "./utils"

async function getCleanSheets(): Promise<Model.CleanSheet[]> {
  return await CleanSheetModel.find({}).exec()
}

export async function getCleanSheetEvents(): Promise<
  Record<string, Rb.CleanSheetEvent[]>
> {
  const [cleanSheetEvents, drafts] = await Promise.all([
    getCleanSheets(),
    getPopulatedDrafts(),
  ])
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
