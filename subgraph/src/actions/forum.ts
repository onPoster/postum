import { JSONValue, TypedMap, store, log, JSONValueKind } from "@graphprotocol/graph-ts"
import { NewPost } from "../../generated/Poster/Poster"
import { Forum, User, AdminRole } from "../../generated/schema"

export function createForum(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = event.transaction.hash.toHexString()
  let forum = new Forum(id)

  let titleValue = args.get("title")
  if (titleValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'title' field", [])
    return 
  }
  forum.title = titleValue.toString()

  let adminsValue = args.get("admins")
  if (adminsValue.kind != JSONValueKind.ARRAY) { 
    log.warning("Skipping post: missing valid Postum 'admins' field", [])
    return 
  }
  let adminArray = adminsValue.toArray()

  for(let i = 0; i < adminArray.length; i++) {
    let userId = adminArray[i].toString()
    let user = User.load(userId)
    if (user == null) { 
      user = new User(userId)
      user.save()
    }
    let adminRole = new AdminRole(forum.id + '-' + user.id)
    adminRole.forum = forum.id
    adminRole.user = user.id
    adminRole.save()
  }

  forum.save()
}

export function editForum(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let idValue = args.get("id")
  if (idValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'id' field", [])
    return 
  }
  let id = idValue.toString()
  let forum = Forum.load(id)
  if (forum == null) { return }

  let senderAdminRole = AdminRole.load(forum.id + "-" + event.transaction.from.toHexString())
  if (senderAdminRole == null) {
    log.error(
      "Permissions: {} not an admin in forum {}",
      [
        event.transaction.from.toHexString(),
        forum.id
      ]
    )
    return
  }

  let titleValue = args.get("title")
  if (titleValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'title' field", [])
    return 
  }
  forum.title = titleValue.toString()

  forum.save()
}

export function deleteForum(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let idValue = args.get("id")
  if (idValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'id' field", [])
    return 
  }
  let id = idValue.toString()
  let forum = Forum.load(id)
  if (forum == null) { return }

  let senderAdminRole = AdminRole.load(forum.id + "-" + event.transaction.from.toHexString())
  if (senderAdminRole == null) {
    log.error(
      "Permissions: {} not an admin in forum {}",
      [
        event.transaction.from.toHexString(),
        forum.id
      ]
    )
    return
  }

  store.remove("Forum", id)
}