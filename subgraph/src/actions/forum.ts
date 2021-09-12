import { JSONValue, TypedMap, log } from "@graphprotocol/graph-ts"
import { NewPost } from "../../generated/Poster/Poster"
import { Forum, User, AdminRole } from "../../generated/schema"
import { getArrayFromJson, getStringFromJson } from "../utils"

export function createForum(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = event.transaction.hash.toHexString()
  let forum = new Forum(id)

  let titleRes = getStringFromJson(args, "title")
  if (titleRes.error != "none") { log.warning(titleRes.error, []); return }
  forum.title = titleRes.data

  let adminsRes = getArrayFromJson(args, "admins")
  if (adminsRes.error != "none") { log.warning(adminsRes.error, []); return }
  let adminArray = adminsRes.data

  for(let i = 0; i < adminArray.length; i++) {
    let userId = adminArray[i].toString()
    let user = User.load(userId)
    if (user == null) { 
      user = new User(userId)
      user.createdAt = event.block.timestamp
      user.save()
    }
    let adminRole = new AdminRole(forum.id + '-' + user.id)
    adminRole.forum = forum.id
    adminRole.user = user.id
    adminRole.deleted = false
    adminRole.createdAt = event.block.timestamp
    adminRole.save()
  }

  forum.deleted = false
  forum.createdAt = event.block.timestamp
  forum.save()
}

export function editForum(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let idRes = getStringFromJson(args, "id")
  if (idRes.error != "none") { log.warning(idRes.error, []); return }

  let forum = Forum.load(idRes.data)
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

  let titleRes = getStringFromJson(args, "title")
  if (titleRes.error != "none") { log.warning(titleRes.error, []); return }
  forum.title = titleRes.data

  forum.lastEditedAt = event.block.timestamp
  forum.save()
}

export function deleteForum(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let idRes = getStringFromJson(args, "id")
  if (idRes.error != "none") { log.warning(idRes.error, []); return }

  let forum = Forum.load(idRes.data)
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

  forum.deleted = true
  forum.deletedAt = event.block.timestamp
  forum.save()
}