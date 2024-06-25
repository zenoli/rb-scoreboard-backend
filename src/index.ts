import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { ApiRouter } from "./routes/api"
import { ImportsRouter } from "./routes/imports"
import morgan from "morgan"
import { startLiveDataImport } from "./cronjobs/import-task"

function connectToMongoDB() {
  const localDevelopment = process.env.STAGE === "local"
  if (localDevelopment) {
    console.log("Running locally. Using MONGO_URL")
  } else {
    console.log("Running on railway. Using MONGO_PRIVATE_URL")
  }

  // Use private network url when run on railway.app
  const mongoUrl = localDevelopment
    ? process.env.MONGO_URL
    : process.env.MONGO_PRIVATE_URL
  mongoose.connect(mongoUrl || "", {
    dbName: "euro-2024",
  })
}

dotenv.config()

connectToMongoDB()

const app: Express = express()
const port = (process.env.PORT || 3001) as number

app.get("/", (req: Request, res: Response) => {
  res.send("RB Scoreboard Backend")
})

app.use(morgan("tiny"))
app.use("/imports", ImportsRouter)
app.use("/api", ApiRouter)

app.listen(port, "::", () => {
  console.log(`Server listening on [::]${port}`)
})

startLiveDataImport()
