import { JSONValue, TypedMap, store, log } from "@graphprotocol/graph-ts"
import { NewPost } from "../../generated/Poster/Poster"
import { Forum, User, AdminRole } from "../../generated/schema"

export function createForum(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = event.transaction.hash.toHexString()
  let forum = new Forum(id)
  forum.title = args.get("title").toString()
  let admins = args.get("admins")
  let adminArray = admins.toArray()
  for(let i = 0; i < adminArray.length; i++) {
    let userId = adminArray[i].toString()
    let user = User.load(userId)
    if (user == null) { user = new User(userId) }
    let adminRole = new AdminRole(forum.id + '-' + user.id)
    adminRole.forum = forum.id
    adminRole.user = user.id
    adminRole.save()
    user.save()
  }

  forum.save()
}

export function editForum(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = args.get("id").toString()
  let forum = Forum.load(id)
  if (forum == null) { return }

  if (!forum.admin_roles.includes(event.transaction.from.toHexString())) {
    log.error(
      "Permissions: {} not an admin in forum {}",
      [
        event.transaction.from.toHexString(),
        id
      ]
    )
    return
  }

  forum.title = args.get("title").toString()

  forum.save()
}

export function deleteForum(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = args.get("id").toString()
  let forum = Forum.load(id)
  if (forum == null) { return }

  if (!forum.admin_roles.includes(event.transaction.from.toHexString())) {
    log.error(
      "Permissions: {} not an admin in forum {}",
      [
        event.transaction.from.toHexString(),
        id
      ]
    )
    return
  }

  store.remove("Forum", id)
}