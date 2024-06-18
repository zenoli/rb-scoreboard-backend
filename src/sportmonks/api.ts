import * as Sportmonks from "../sportmonks/types"

export async function get(
  routeSegments: string[],
  queryParams: URLSearchParams
) {
  const baseUrl = `${process.env.API_URL}/${process.env.API_VERSION}`
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
