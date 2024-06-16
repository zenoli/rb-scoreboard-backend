import { Router, Request, Response } from "express"
import { importSportmonkTypes, importTeams } from "../imports"

const router: Router = Router()

router.post("/sportmonks-types", async (req: Request, res: Response) => {
  await importSportmonkTypes()
  res.send("Sportmonks Type import successful")
})

router.post("/teams", async (req: Request, res: Response) => {
  await importTeams()
  res.send("Team and Player import successful")
})

router.post("/fixtures", async (req: Request, res: Response) => {
  await importTeams()
  res.send("Team and Player import successful")
})

export default router
