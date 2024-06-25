import { Router, Request, Response } from "express"
import { getEventsOfUser, getUserToEventsMap } from "../../services/events"
import { capitalize } from "lodash"

const EventsRouter: Router = Router()

EventsRouter.get("/", async (req: Request, res: Response) => {
  const events = await getUserToEventsMap()
  res.json(events)
})

EventsRouter.get("/:user", async (req: Request, res: Response) => {
  const eventsOfUser = await getEventsOfUser(capitalize(req.params.user))
  res.json(eventsOfUser)
})

export { EventsRouter }
