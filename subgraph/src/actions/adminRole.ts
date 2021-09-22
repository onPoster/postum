import { JSONValue, TypedMap, log } from "@graphprotocol/graph-ts"
import { NewPost } from "../../generated/Poster/Poster"
import { Forum, User, AdminRole } from "../../generated/schema"
import { getStringFromJson } from "../utils"

export function grantAdminRole(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let forumRes = getStringFromJson(args, "forum")
  if (forumRes.error != "none") { log.warning(forumRes.error, []); return }

  let forum = Forum.load(forumRes.data)
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

  let userRes = getStringFromJson(args, "user")
  if (userRes.error != "none") { log.warning(userRes.error, []); return }
  let userId = userRes.data

  let user = User.load(userId)
  if (user == null) { 
    user = new User(userId) 
    user.createdAt = event.block.timestamp
    user.save()
  }
  let id = forum.id + "-" + user.id
  let adminRole = new AdminRole(id)
  adminRole.forum = forum.id
  adminRole.user = user.id
  adminRole.deleted = false
  adminRole.createdAt = event.block.timestamp
  adminRole.save()
}

export function removeAdminRole(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let forumRes = getStringFromJson(args, "forum")
  if (forumRes.error != "none") { log.warning(forumRes.error, []); return }
  let forumId = forumRes.data

  let userRes = getStringFromJson(args, "user")
  if (userRes.error != "none") { log.warning(userRes.error, []); return }
  let userId = userRes.data

  let senderAdminRole = AdminRole.load(forumId + "-" + event.transaction.from.toHexString())
  if (senderAdminRole == null || senderAdminRole.deleted == true) {
    log.error(
      "Permissions: {} not an admin in forum {}",
      [
        event.transaction.from.toHexString(),
        forumId
      ]
    )
    return
  }

  let adminRole = AdminRole.load(forumId + "-" + userId)
  if (adminRole == null) { return }

  adminRole.deleted = true
  adminRole.deletedAt = event.block.timestamp
  adminRole.save()
}