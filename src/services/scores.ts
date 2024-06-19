import DraftModel from "../models/draft"
import EventModel from "../models/event"
import * as Model from "../models/types"

async function getAllEvents(): Promise<Model.PopulatedEvent[]> {
  return await EventModel.find({})
    .select([
      "name",
      "player",
      "relatedPlayer",
      "minute",
      "extraMinute",
      "fixture",
    ])
    .populate<Model.PopulatedEvent>([
      { path: "type" },
      {
        path: "player",
        populate: ["position", "detailedPosition"],
      },
      { path: "relatedPlayer" },
      { path: "participant" },
      {
        path: "fixture",
        populate: { path: "participants" },
      },
    ])
    .exec()
}

async function getDrafts(): Promise<Model.Draft[]> {
  return await DraftModel.find({}).exec()
}

function extractTeams(event: Model.PopulatedEvent) {
  const team: Model.PopulatedTeam = event.participant
  const oponentTeam = event.fixture.participants.find(
    (participant) => participant._id != team._id
  ) as Model.PopulatedTeam
  return { team, oponentTeam }
}

export async function getScores() {
  const relevantEventIds = [
    14, // Goal
    18, // Substitution
    19, // Yellow Card
    20, // Red Card
    21, // Yello/Red Card
  ]

  const events = await getAllEvents()
  const drafts = await getDrafts()

  console.log(drafts)
  // console.log(events[0].fixture.participants[0] as Team)
  const relevantEvents = events.filter(
    (event) =>
      relevantEventIds.includes(event.type._id) && event.player !== null // Yellow cards by coaches don't resolve to a player
  )

  const response = relevantEvents.map((event) => {
    const { team, oponentTeam } = extractTeams(event)
    const player = event.player as Model.PopulatedPlayer
    return {
      name: event.type.name,
      minute: event.minute,
      extraMinute: event.extraMinute,
      player: {
        displayName: player.displayName,
        imagePath: player.imagePath,
        jerseyNumber: player.jerseyNumber,
        position: player.position.name,
        detailedPosision: player.detailedPosition.name,
      },
      team: {
        name: team.name,
        shortCode: team.shortCode,
        imagePath: team.imagePath,
      },
      oponentTeam: {
        name: oponentTeam.name,
        shortCode: oponentTeam.shortCode,
        imagePath: oponentTeam.imagePath,
      },
    }
  })

  return response
}
