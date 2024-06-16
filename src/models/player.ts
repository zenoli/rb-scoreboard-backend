import mongoose from "mongoose"
const { Schema, model } = mongoose

const PlayerModel = model(
  "Player",
  new Schema({
    _id: { type: Number, required: true },
    transferId: { type: Number },
    teamPlayerId: { type: Number, required: true },
    team: { type: Number, ref: "Team" },
    position: { type: Number, ref: "SportmonksType" },
    detailedPosition: { type: Number, ref: "SportmonksType" },
    start: { type: Date },
    end: { type: Date },
    captain: { type: Boolean },
    jerseyNumber: { type: Number },
    sportId: { type: Number, required: true },
    countryId: { type: Number, required: true },
    nationalityId: { type: Number, required: true },
    cityId: { type: Number },
    commonName: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    name: { type: String, required: true },
    displayName: { type: String, required: true },
    imagePath: { type: String, required: true },
    height: { type: String, required: true },
    weight: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, required: true },
  })
)

export default PlayerModel
