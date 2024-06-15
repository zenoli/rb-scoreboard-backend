import mongoose from "mongoose"
import Blog from "./models/Blog"
import * as SportMonks from "./services/sportmonks.service"

export async function importTeams() {
  const seasonId = process.env.SEASON_ID || ""
  const teams = await SportMonks.get(
    ["football", "teams", "seasons", seasonId],
    new URLSearchParams({ include: "players.player" })
  )

  console.log(teams)
  await mongoose.connect(process.env.MONGO_URL || "", {
    dbName: "euro-2024",
  })
  // Create a new blog post object
  const article = new Blog({
    title: "Awesome Post!",
    slug: "awesome-post",
    published: true,
    content: "This is the best post ever",
    tags: ["featured", "announcement"],
  })

  // Insert the article in our MongoDB database
  await article.save()
}
