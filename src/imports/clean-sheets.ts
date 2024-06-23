import CleanSheetModel from "../models/clean-sheet"

async function fetchRawCleanSheetsData() {
  const response = await fetch(
    "https://compstats.uefa.com/v1/player-ranking?competitionId=3&limit=500&offset=0&optionalFields=PLAYER&order=DESC&phase=TOURNAMENT&seasonYear=2024&stats=clean_sheet",
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.6",
        "cache-control": "no-cache",
        pragma: "no-cache",
        priority: "u=1, i",
        "sec-ch-ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Brave";v="126"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
        "x-api-key":
          "ceeee1a5bb209502c6c438abd8f30aef179ce669bb9288f2d1cf2fa276de03f4",
        Referer: "https://www.uefa.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: null,
      method: "GET",
    }
  )
  return (await response.json()) as any[]
}

export async function importCleanSheets() {
  const rawCleanSheetsData = await fetchRawCleanSheetsData()
  const cleanSheets = rawCleanSheetsData
    .map((item) => ({
      _id: item.player.id,
      name: item.player.internationalName,
      country: item.player.countryCode,
      position: item.player.nationalFieldPosition,
      cleanSheets: item.statistics[0]?.value || 0,
    }))
    .filter((item) => item.cleanSheets > 0 && item.position === "GOALKEEPER")
  console.log(cleanSheets)
  await CleanSheetModel.bulkWrite(
    cleanSheets.map((cleanSheet, i) => {
      return {
        updateOne: {
          filter: { _id: cleanSheet._id },
          update: cleanSheet,
          upsert: true,
        },
      }
    })
  )
}
