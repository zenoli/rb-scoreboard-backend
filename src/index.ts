import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import ImportsRouter from "./routes/imports"

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URL || "", {
  dbName: "euro-2024",
})

app.get("/", (req: Request, res: Response) => {
  res.send("RB Scoreboard Backend")
})

app.use("/imports", ImportsRouter)

// app.post("/import/sportmonks-types", (req: Request, res: Response) => {
//   importSportmonkTypes()
//   res.send("Sportmonks Types import successful")
// })
//
// app.post("/import/teams", (req: Request, res: Response) => {
//   importTeamsAndPlayers()
//   res.send("Teams Types import successful")
// })

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
