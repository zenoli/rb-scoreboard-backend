import { Router, Request, Response } from "express"
import { getScoreEvents, getScoreEventsOfUser } from "../../services/events"
import { capitalize } from "lodash"

const EventsRouter: Router = Router()

EventsRouter.get("/", async (req: Request, res: Response) => {
  const events = await getScoreEvents()
  res.json(events)
})

EventsRouter.get("/:user", async (req: Request, res: Response) => {
  const eventsOfUser = await getScoreEventsOfUser(capitalize(req.params.user))
  res.json(eventsOfUser)
})

export { EventsRouter }
