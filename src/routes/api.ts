import { Router, Request, Response } from "express"
import { getScores } from "../services/scores"

const router: Router = Router()

router.get("/events", async (req: Request, res: Response) => {})

router.get("/scores", async (req: Request, res: Response) => {
  const events = await getScores()
  res.send(events)
})

export default router
