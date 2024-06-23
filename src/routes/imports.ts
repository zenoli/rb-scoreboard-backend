import { Router, Request, Response } from "express"
import {
  importDrafts,
  importFixtures,
  importTypes,
  importTeams,
  importCleanSheets,
} from "../imports"

const router: Router = Router()

router.post("/drafts", async (req: Request, res: Response) => {
  await importDrafts()
  res.send("Drafts import successful")
})

router.post("/types", async (req: Request, res: Response) => {
  await importTypes()
  res.send("Type import successful")
})

router.post("/teams", async (req: Request, res: Response) => {
  await importTeams()
  res.send("Team and Player import successful")
})

router.post("/fixtures", async (req: Request, res: Response) => {
  await importFixtures()
  res.send("Fixture import successful")
})

router.post("/clean-sheets", async (req: Request, res: Response) => {
  await importCleanSheets()
  res.send("Clean Sheets import successful")
})

export default router
