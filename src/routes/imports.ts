import { Router, Request, Response } from "express"
import {
  importDrafts,
  importFixtures,
  importSportmonkTypes,
  importTeams,
} from "../imports"

const router: Router = Router()

router.post("/drafts", async (req: Request, res: Response) => {
  await importDrafts()
  res.send("Drafts import successful")
})

router.post("/sportmonks-types", async (req: Request, res: Response) => {
  await importSportmonkTypes()
  res.send("Sportmonks Type import successful")
})

router.post("/teams", async (req: Request, res: Response) => {
  await importTeams()
  res.send("Team and Player import successful")
})

router.post("/fixtures", async (req: Request, res: Response) => {
  await importFixtures()
  res.send("Fixture import successful")
})

export default router
