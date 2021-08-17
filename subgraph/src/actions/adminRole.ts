import { JSONValue, TypedMap, store, log, JSONValueKind } from "@graphprotocol/graph-ts"
import { NewPost } from "../../generated/Poster/Poster"
import { Forum, User, AdminRole } from "../../generated/schema"

export function grantAdminRole(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let forumIdValue = args.get("forum")
  if (forumIdValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'forum' field", [])
    return 
  }
  let forumId = forumIdValue.toString()
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

  let userIdValue = args.get("user")
  if (userIdValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'user' field", [])
    return 
  }
  let userId = userIdValue.toString()
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
  let forumIdValue = args.get("forum")
  if (forumIdValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'forum' field", [])
    return 
  }
  let forumId = forumIdValue.toString()
  let forum = Forum.load(forumId)
  if (forum == null) { return }

  let userIdValue = args.get("user")
  if (userIdValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'user' field", [])
    return 
  }
  let userId = userIdValue.toString()
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