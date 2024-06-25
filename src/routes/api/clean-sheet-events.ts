import { Router, Request, Response } from "express"
import { capitalize } from "lodash"
import {
  getCleanSheetsOfUser,
  getUsersToCleanSheetsMap,
} from "../../services/clean-sheets"

const CleanSheetsRouter: Router = Router()

CleanSheetsRouter.get("/", async (req: Request, res: Response) => {
  const events = await getUsersToCleanSheetsMap()
  res.json(events)
})

CleanSheetsRouter.get("/:user", async (req: Request, res: Response) => {
  const eventsOfUser = await getCleanSheetsOfUser(
    capitalize(req.params.user)
  )
  res.json(eventsOfUser)
})

export { CleanSheetsRouter }
