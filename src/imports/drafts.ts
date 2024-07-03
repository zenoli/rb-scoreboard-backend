import drafts from "../../data/drafts.json"
import DraftModel from "../models/draft"
import { initializeCollection, upsertCollection } from "../utils/db"

export async function importDrafts(init = false) {
  const draftsMapped = drafts.map((draft, i) => ({ _id: i, ...draft }))
  if (init) {
    await initializeCollection(DraftModel, draftsMapped)
  } else {
    await upsertCollection(DraftModel, draftsMapped)
  }
}
