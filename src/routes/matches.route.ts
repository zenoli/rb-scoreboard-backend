import { withDb } from "@services/db.service"
import { getMatch, getMatches } from "@services/matches.service"
import { Request, Response, Router } from "express"
import { Db } from "mongodb"

const router: Router = Router()

router.get("/", withDb(async (req: Request, res: Response, db: Db) => {
  res.send(await getMatches(db))
}))

router.get("/:matchId", withDb(async (req: Request, res: Response, db: Db) => {
  const id = Number(req.params.matchId)
  res.send(await getMatch(db, id))
}))

export default router
