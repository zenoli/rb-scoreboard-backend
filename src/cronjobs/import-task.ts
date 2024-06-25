import cron from "node-cron"
import { importCleanSheets, importFixtures } from "../imports"
import { format } from "date-fns"

const EVERY_30_SECONDS = "*/30 * 17-23 * June,July *"
const EVERY_10_SECONDS = "*/10 * * * * *"

export function startLiveDataImport() {
  cron.schedule(EVERY_30_SECONDS, async () => {
    await Promise.all([importFixtures(), importCleanSheets()])

    console.log(
      `[${format(new Date(), "yyyy-MM-dd HH:mm:ss")}] Import successful`
    )
  })
}
