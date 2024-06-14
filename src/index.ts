import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import { importTeams } from "./import"

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

app.get("/", (req: Request, res: Response) => {
  res.send("RB Scoreboard Backend")
})

app.post("/import", (req: Request, res: Response) => {
  importTeams()
  res.send("Import")
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
