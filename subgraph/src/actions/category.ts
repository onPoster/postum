import { JSONValue, TypedMap, store, log } from "@graphprotocol/graph-ts"
import { NewPost } from "../../generated/Poster/Poster"
import { Forum, Category } from "../../generated/schema"

export function createCategory(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let forumId = args.get("forum").toString()
  let forum = Forum.load(forumId)
  if (forum == null) { return }

  if (!forum.admin_roles.includes(event.transaction.from.toHexString())) {
    log.error(
      "Permissions: {} not an admin in forum {}",
      [
        event.transaction.from.toHexString(),
        forumId
      ]
    )
    return
  }

  let id = event.transaction.hash.toHexString()
  let category = new Category(id)
  category.forum = forumId
  category.title = args.get("title").toString()
  category.description = args.get("description").toString()

  category.save()
}

export function editCategory(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = args.get("id").toString()
  let category = Category.load(id)
  if (category == null) { return }

  let forum = Forum.load(category.forum)
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

  category.title = args.get("title").toString()
  category.description = args.get("description").toString()

  category.save()
}

export function deleteCategory(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = args.get("id").toString()
  let category = Category.load(id)
  if (category == null) { return }

  let forum = Forum.load(category.forum)
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

  store.remove("Category", id)
}