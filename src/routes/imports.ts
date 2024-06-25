import { Router, Request, Response } from "express"
import {
  importDrafts,
  importFixtures,
  importTypes,
  importTeams,
  importCleanSheets,
} from "../imports"

const ImportsRouter: Router = Router()

ImportsRouter.post("/drafts", async (req: Request, res: Response) => {
  await importDrafts()
  res.send("Drafts import successful")
})

ImportsRouter.post("/types", async (req: Request, res: Response) => {
  await importTypes()
  res.send("Type import successful")
})

ImportsRouter.post("/teams", async (req: Request, res: Response) => {
  await importTeams()
  res.send("Team and Player import successful")
})

ImportsRouter.post("/fixtures", async (req: Request, res: Response) => {
  await importFixtures()
  res.send("Fixture import successful")
})

ImportsRouter.post("/clean-sheets", async (req: Request, res: Response) => {
  await importCleanSheets()
  res.send("Clean Sheets import successful")
})

export { ImportsRouter }

