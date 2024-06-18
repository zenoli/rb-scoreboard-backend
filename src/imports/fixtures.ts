import * as Sportmonks from "../types/sportmonks"
import * as SportmonksApi from "../services/sportmonks-api"
import { mapEvent, mapFixture } from "../mappers/team.mapper"
import { flatMap } from "lodash"
import FixtureModel from "../models/fixture"
import EventModel from "../models/event"

export async function importFixtures() {
  const seasonId = process.env.SEASON_ID || ""
  const sportmonkResponse = await SportmonksApi.get(
    ["football", "seasons", seasonId],
    new URLSearchParams({ include: "fixtures.events;fixtures.participants" })
  )

  const season = sportmonkResponse.data as Sportmonks.Season
  const fixtures = season.fixtures
  const events = flatMap(fixtures, (fixture) => fixture.events)
  console.log(fixtures[0])
  await Promise.all([
    FixtureModel.bulkWrite(
      fixtures.map((fixture) => ({
        updateOne: {
          filter: { _id: fixture.id },
          update: mapFixture(fixture),
          upsert: true,
        },
      }))
    ),
    EventModel.bulkWrite(
      events.map((event) => ({
        updateOne: {
          filter: { _id: event.id },
          update: mapEvent(event),
          upsert: true,
        },
      }))
    ),
  ])
}
