import { Router, Request, Response } from "express"
import { getScores } from "../../services/scores"
import { getDrafts, getPopulatedDrafts } from "../../services/drafts"
import { EventsRouter } from "./events"
import { UsersRouter } from "./users"

const ApiRouter: Router = Router()

ApiRouter.get("/scores", async (req: Request, res: Response) => {
  const events = await getScores()
  res.json(events)
})

ApiRouter.get("/drafts", async (req: Request, res: Response) => {
  const populatedDrafts = await getPopulatedDrafts()
  res.send(populatedDrafts)
})

ApiRouter.use("/events", EventsRouter)
ApiRouter.use("/users", UsersRouter)

export { ApiRouter }
