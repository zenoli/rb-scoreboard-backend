import mongoose from "mongoose"
import Blog from "./model/Blog"

export async function importTeams() {
  console.log("SEASON_ID", process.env.SEASON_ID)
  const response = await fetch(
    `${process.env.API_URL}/${process.env.API_VERSION}/football/teams/seasons/${process.env.SEASON_ID}?include=players.player`,
    {
      method: "GET",
      headers: {
        Authorization: process.env.API_TOKEN || "",
      },
    }
  )

  console.log(response)
  const teams = await response.json()

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
