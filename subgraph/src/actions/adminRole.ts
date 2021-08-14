import { JSONValue, TypedMap, store, log } from "@graphprotocol/graph-ts"
import { NewPost } from "../../generated/Poster/Poster"
import { Forum, User, AdminRole } from "../../generated/schema"

export function grantAdminRole(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let forumId = args.get("forum").toString()
  let forum = Forum.load(forumId)
  if (forum == null) { return }

  if (!forum.admin_roles.includes(event.transaction.from.toHexString())) {
    log.error(
      "Permissions: {} not an admin in forum {}",
      [
        event.transaction.from.toHexString(),
        forum.id
      ]
    )
    return
  }

  let userId = args.get("user").toString()
  let user = User.load(userId)
  if (user == null) { 
    user = new User(userId) 
    user.save()
  }
  let id = forum.id + "-" + user.id
  let adminRole = new AdminRole(id)
  adminRole.save()
}

export function removeAdminRole(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let forumId = args.get("forum").toString()
  let forum = Forum.load(forumId)
  if (forum == null) { return }

  let userId = args.get("user").toString()
  let user = User.load(userId)
  if (user == null) { return }

  if (!forum.admin_roles.includes(event.transaction.from.toHexString())) {
    log.error(
      "Permissions: {} not an admin in forum {}",
      [
        event.transaction.from.toHexString(),
        forum.id
      ]
    )
    return
  }

  store.remove("AdminRole", forum.id + "-" + user.id)
}