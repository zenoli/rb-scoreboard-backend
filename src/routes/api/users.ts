import { Router, Request, Response } from "express"
import { getScoreEvents, getScoreEventsOfUser } from "../../services/events"
import { getUsers } from "../../services/users"
import { getPopulatedDrafts, getPopulatedDraftsOfUser } from "../../services/drafts"

const UsersRouter: Router = Router()

UsersRouter.get("/", async (req: Request, res: Response) => {
  res.json(await getUsers())
})

UsersRouter.get("/drafts", async (req: Request, res: Response) => {
  res.json(await getPopulatedDrafts())
})

UsersRouter.get("/drafts/:user", async (req: Request, res: Response) => {
  const eventsOfUser = await getPopulatedDraftsOfUser(req.params.user)
  res.json(eventsOfUser)
})

export { UsersRouter }
