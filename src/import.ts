import mongoose from "mongoose"
import * as SportMonks from "./services/sportmonks.service"
import { SmType } from "./types/sportmonks"
import SportmonksType from "./models/SportmonksType"
;("https://api.sportmonks.com/v3/core/types?api_token=$API_TOKEN&filter=populate&per_page=1000")

export async function importSportmonkTypes() {
  const sportmonkResponse = await SportMonks.get(
    ["core", "types"],
    new URLSearchParams({ filter: "populate", per_page: "1000" })
  )
  await mongoose.connect(process.env.MONGO_URL || "", {
    dbName: "euro-2024",
  })
  // Create a new blog post object
  const article = new SportmonksType({
    title: "Awesome Post!",
    slug: "awesome-post",
    published: true,
    content: "This is the best post ever",
    tags: ["featured", "announcement"],
  })

  const sportmonkTypes = sportmonkResponse.data as SmType[]

  console.log(sportmonkTypes[0])
}

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
  // const article = new Blog({
  //   title: "Awesome Post!",
  //   slug: "awesome-post",
  //   published: true,
  //   content: "This is the best post ever",
  //   tags: ["featured", "announcement"],
  // })

  // Insert the article in our MongoDB database
  // await article.save()
}
