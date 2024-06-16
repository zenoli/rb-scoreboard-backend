import { Router, Request, Response } from "express"
import { importSportmonkTypes } from "../imports/sportmonks-types"
import { importTeamsAndPlayers } from "../imports/teams"

const router: Router = Router()

router.post("/sportmonks-types", async (req: Request, res: Response) => {
  await importSportmonkTypes()
  res.send("Sportmonks Type import successful")
})

router.post("/teams", async (req: Request, res: Response) => {
  await importTeamsAndPlayers()
  res.send("Team and Player import successful")
})

export default router
