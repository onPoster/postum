import { JSONValue, TypedMap, store, log, JSONValueKind } from "@graphprotocol/graph-ts"
import { NewPost } from "../../generated/Poster/Poster"
import { Forum, Category, AdminRole } from "../../generated/schema"

export function createCategory(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let forumIdValue = args.get("forum")
  if (forumIdValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'forum' field", [])
    return 
  }
  let forumId = forumIdValue.toString()
  let forum = Forum.load(forumId)
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

  let id = event.transaction.hash.toHexString()
  let category = new Category(id)
  category.forum = forumId

  let titleValue = args.get("title")
  if (titleValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'title' field", [])
    return 
  }
  category.title = titleValue.toString()

  let descriptionValue = args.get("description")
  if (descriptionValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'description' field", [])
    return 
  }
  category.description = descriptionValue.toString()

  category.save()
}

export function editCategory(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let idValue = args.get("id")
  if (idValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'id' field", [])
    return 
  }
  let id = idValue.toString()
  let category = Category.load(id)
  if (category == null) { return }

  let forum = Forum.load(category.forum)
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
  category.title = titleValue.toString()
  
  let descriptionValue = args.get("description")
  if (descriptionValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'description' field", [])
    return 
  }
  category.description = descriptionValue.toString()

  category.save()
}

export function deleteCategory(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let idValue = args.get("id")
  if (idValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'id' field", [])
    return 
  }
  let id = idValue.toString()
  let category = Category.load(id)
  if (category == null) { return }

  let forum = Forum.load(category.forum)
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

  store.remove("Category", id)
}