// export async function importTeamsAndPlayers() {
//   const seasonId = process.env.SEASON_ID || ""
//   const sportmonkResponse = await SportMonks.get(
//     ["football", "teams", "seasons", seasonId],
//     new URLSearchParams({ include: "players.player" })
//   )
//
//   const teams = sportmonkResponse.data as SmTeam[]
//   const nationalTeams = teams.filter((team) => team.type === "national")
//   const teamPlayers = flatMap(nationalTeams, (team) => team.players)
//
//   await Promise.all([
//     TeamModel.bulkWrite(
//       nationalTeams.map((team) => ({
//         updateOne: {
//           filter: { _id: team.id },
//           update: mapTeam(team),
//           upsert: true,
//         },
//       }))
//     ),
//     PlayerModel.bulkWrite(
//       teamPlayers.map((teamPlayer) => ({
//         updateOne: {
//           filter: { _id: teamPlayer.player_id },
//           update: mapPlayer(teamPlayer),
//           upsert: true,
//         },
//       }))
//     ),
//   ])
// }
//
