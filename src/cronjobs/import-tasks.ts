import cron from "node-cron"
import {
  importCleanSheets,
  importDrafts,
  importFixtures,
  importTeams,
  importTypes,
} from "../imports"
import { format } from "date-fns"

const EVERY_30_SECONDS = "*/30 * 17-23 * June,July *"
const EVERY_30_SECONDS_SERVER = "*/30 * 15-21 * June,July *" // Account for different time offset on railway server
const EVERY_DAY_SERVER = "0 4 * June,July *" // Account for different time offset on railway server
const EVERY_10_SECONDS = "*/10 * * * * *"

async function initialDataImportTask() {
  await Promise.all([
    importCleanSheets(true),
    importDrafts(true),
    importFixtures(true),
    importTeams(true),
    importTypes(true),
  ])

  console.log(
    `[${format(new Date(), "yyyy-MM-dd HH:mm:ss")}] Initial import successful`
  )
}

export function startInitialDataImport() {
  cron.schedule(EVERY_DAY_SERVER, initialDataImportTask)
}

async function liveDataImportTask() {
  await Promise.all([importFixtures(), importCleanSheets()])

  console.log(
    `[${format(new Date(), "yyyy-MM-dd HH:mm:ss")}] Live import successful`
  )
}

export function startLiveDataImport() {
  cron.schedule(EVERY_30_SECONDS_SERVER, liveDataImportTask)
}

