import * as Sportmonks from "../sportmonks/types"

export async function get(
  routeSegments: string[],
  queryParams: URLSearchParams
) {
  const apiUrl = process.env.API_URL || "https://api.sportmonks.com"
  const apiVersion = process.env.API_VERSION || "v3"
  const baseUrl = `${apiUrl}/${apiVersion}`
  const route = routeSegments.join("/")
  const url = `${baseUrl}/${route}?${queryParams.toString()}`
  console.log("URL", url)

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: process.env.API_TOKEN || "",
    },
  })
  return (await response.json()) as Sportmonks.Response
}
