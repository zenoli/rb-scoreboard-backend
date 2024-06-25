import DraftModel from "../models/draft"

export async function getUsers() {
  const users = await DraftModel.find({})
    .select<{ _id: number; user: string }>(["_id", "user"])
    .exec()

  return users.map((user) => ({ id: user._id, user: user.user }))
}
