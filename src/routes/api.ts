import { Router, Request, Response } from "express"
import { getScores } from "../services/scores"
import { getDrafts } from "../services/drafts"

const router: Router = Router()

router.get("/events", async (req: Request, res: Response) => {})

router.get("/scores", async (req: Request, res: Response) => {
  const events = await getScores()
  res.json(events)
})

router.get("/drafts", async (req: Request, res: Response) => {
  const drafts = await getDrafts()
  res.send(drafts)
})

export default router
