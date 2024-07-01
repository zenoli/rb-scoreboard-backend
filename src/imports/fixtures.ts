import * as Sportmonks from "../sportmonks/types"
import * as SportmonksApi from "../sportmonks/api"
import * as Model from "../models/types"
import { flatMap } from "lodash"
import { mapEvent, mapFixture } from "../mappers"
import FixtureModel from "../models/fixture"
import EventModel from "../models/event"
import mongoose from "mongoose"
import { Mode } from "fs"
import { updateCollection } from "../utils/db"

export async function importFixtures() {
  const seasonId = process.env.SEASON_ID || "22842"
  const sportmonkResponse = await SportmonksApi.get(
    ["football", "seasons", seasonId],
    new URLSearchParams({ include: "fixtures.events;fixtures.participants" })
  )

  const season = sportmonkResponse.data as Sportmonks.Season
  const fixtures = season.fixtures
  const events = flatMap(fixtures, (fixture) => fixture.events)

  await Promise.all([
    updateCollection<Model.Fixture>(FixtureModel, fixtures.map(mapFixture)),
    updateCollection<Model.Event>(EventModel, events.map(mapEvent)),
  ])
}
