import { Router, Request, Response } from "express"
import { getEvents } from "../services/events"

const router: Router = Router()

router.get("/events", async (req: Request, res: Response) => {
  const events = await getEvents()
  res.send(events)
})


export default router
