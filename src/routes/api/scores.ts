import { Router, Request, Response } from "express"
import { getPlayerScores, getScores } from "../../services/scores"

const ScoresRouter: Router = Router()

ScoresRouter.get("/", async (req: Request, res: Response) => {
  const scores = await getScores()
  res.json(scores)
})

ScoresRouter.get("/players", async (req: Request, res: Response) => {
  const playerScores = await getPlayerScores()
  res.json(playerScores)
})

export { ScoresRouter }
