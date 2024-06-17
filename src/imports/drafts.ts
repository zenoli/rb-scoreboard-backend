import drafts from "../../data/drafts.json"
import DraftModel from "../models/draft"

export async function importDrafts() {
  await DraftModel.bulkWrite(
    drafts.map((draft, i) => ({
      updateOne: {
        filter: { _id: i },
        update: draft,
        upsert: true,
      },
    }))
  )
}
