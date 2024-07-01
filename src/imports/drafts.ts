import drafts from "../../data/drafts.json"
import DraftModel from "../models/draft"
import { updateCollection } from "../utils/db"

export async function importDrafts() {
  await updateCollection(
    DraftModel,
    drafts.map((draft, i) => ({ _id: i, ...draft }))
  )
}
