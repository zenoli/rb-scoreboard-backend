import { Router, Request, Response } from "express"
import { getScores } from "../../services/scores"
import { EventsRouter } from "./events"
import { UsersRouter } from "./users"
import { CleanSheetsRouter } from "./clean-sheet-events"
import { ScoresRouter } from "./scores"

const ApiRouter: Router = Router()

ApiRouter.use("/scores", ScoresRouter)
ApiRouter.use("/events", EventsRouter)
ApiRouter.use("/clean-sheets", CleanSheetsRouter)
ApiRouter.use("/users", UsersRouter)

export { ApiRouter }
