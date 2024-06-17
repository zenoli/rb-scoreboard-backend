import EventModel from "../models/event"

export async function getEvents() {
  const relevantEventIds = [
    14, // Goal
    18, // Substitution
    19, // Yellow Card
    20, // Red Card
    21, // Yello/Red Card
  ]
  const events = await EventModel.find({}).populate([
    { path: "type", select: "name" },
    {
      path: "fixture",
      select: "participants",
      populate: { path: "participants", select: "name" },
    },
  ])
  console.log(events[0])

  return events
}
