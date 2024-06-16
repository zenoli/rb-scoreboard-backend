import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import { importTeams, importSportmonkTypes } from "./import"
import { SmType } from "./types/sportmonks"

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

app.get("/", (req: Request, res: Response) => {
  res.send("RB Scoreboard Backend")
})

app.post("/import/sportmonks-types", (req: Request, res: Response) => {
  importSportmonkTypes()
  res.send("Import")
})

app.post("/import/teams", (req: Request, res: Response) => {
  importTeams()
  res.send("Import")
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
