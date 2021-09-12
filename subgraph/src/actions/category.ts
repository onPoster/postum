import { JSONValue, TypedMap, log } from "@graphprotocol/graph-ts"
import { NewPost } from "../../generated/Poster/Poster"
import { Forum, Category, AdminRole } from "../../generated/schema"
import { getStringFromJson } from "../utils"

export function createCategory(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let forumRes = getStringFromJson(args, "forum")
  if (forumRes.error != "none") { log.warning(forumRes.error, []); return }
  let forumId = forumRes.data

  let forum = Forum.load(forumId)
  if (forum == null) { return }

  let senderAdminRole = AdminRole.load(forum.id + "-" + event.transaction.from.toHexString())
  if (senderAdminRole == null || senderAdminRole.deleted == true) {
    log.error(
      "Permissions: {} not an admin in forum {}",
      [
        event.transaction.from.toHexString(),
        forum.id
      ]
    )
    return
  }

  let id = event.transaction.hash.toHexString()
  let category = new Category(id)
  category.forum = forumId

  let titleRes = getStringFromJson(args, "title")
  if (titleRes.error != "none") { log.warning(titleRes.error, []); return }
  category.title = titleRes.data

  let descripRes = getStringFromJson(args, "description")
  if (descripRes.error != "none") { log.warning(descripRes.error, []); return }
  category.description = descripRes.data

  category.deleted = false
  category.createdAt = event.block.timestamp
  category.save()
}

export function editCategory(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let idRes = getStringFromJson(args, "id")
  if (idRes.error != "none") { log.warning(idRes.error, []); return }

  let category = Category.load(idRes.data)
  if (category == null) { return }

  let forum = Forum.load(category.forum)
  let senderAdminRole = AdminRole.load(forum.id + "-" + event.transaction.from.toHexString())
  if (senderAdminRole == null || senderAdminRole.deleted == true) {
    log.error(
      "Permissions: {} not an admin in forum {}",
      [
        event.transaction.from.toHexString(),
        forum.id
      ]
    )
    return
  }

  let titleRes = getStringFromJson(args, "title")
  if (titleRes.error != "none") { log.warning(titleRes.error, []); return }
  category.title = titleRes.data
  
  let descripRes = getStringFromJson(args, "description")
  if (descripRes.error != "none") { log.warning(descripRes.error, []); return }
  category.description = descripRes.data

  category.lastEditedAt = event.block.timestamp
  category.save()
}

export function deleteCategory(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let idRes = getStringFromJson(args, "id")
  if (idRes.error != "none") { log.warning(idRes.error, []); return }

  let category = Category.load(idRes.data)
  if (category == null) { return }

  let forum = Forum.load(category.forum)
  let senderAdminRole = AdminRole.load(forum.id + "-" + event.transaction.from.toHexString())
  if (senderAdminRole == null || senderAdminRole.deleted == true) {
    log.error(
      "Permissions: {} not an admin in forum {}",
      [
        event.transaction.from.toHexString(),
        forum.id
      ]
    )
    return
  }

  category.deleted = true
  category.deletedAt = event.block.timestamp
  category.save()
}