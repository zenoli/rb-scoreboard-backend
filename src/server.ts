import "./utils/dotenv"
import express, { Express, Request, Response } from "express"
import AssistRouter from "./routes/assists.route"
import MatchRouter from "./routes/matches.route"
import ScoresRouter from "./routes/scores.route"
import DraftsRouter from "./routes/drafts.route"
import morgan from "morgan"

const app: Express = express()
const port = process.env.PORT || 3000

app.use(morgan("tiny"))
app.use("/assists", AssistRouter)
app.use("/matches", MatchRouter)
app.use("/drafts", DraftsRouter)
app.use("/scores", ScoresRouter)
app.get("/", (req: Request, res: Response) => res.send("Hello RB Scoreboard"))

app.listen(port, () => {
  console.log(`Backend API started. Listening on port ${port}`)
})
