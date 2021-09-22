import { JSONValue, TypedMap, log } from "@graphprotocol/graph-ts"
import { NewPost } from "../../generated/Poster/Poster"
import { Forum, AdminRole, Category, Thread, User, Post } from "../../generated/schema"
import { getStringFromJson } from "../utils"

export function createThread(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let forumRes = getStringFromJson(args, "forum")
  if (forumRes.error != "none") { log.warning(forumRes.error, []); return }

  let forum = Forum.load(forumRes.data)
  if (forum == null) { return }

  let id = event.transaction.hash.toHexString()
  let thread = new Thread(id)
  thread.forum = forum.id

  let titleRes = getStringFromJson(args, "title")
  if (titleRes.error != "none") { log.warning(titleRes.error, []); return }
  thread.title = titleRes.data

  let authorId = event.transaction.from.toHexString()
  let author = User.load(authorId)
  if (author == null) { 
    author = new User(authorId) 
    author.createdAt = event.block.timestamp
    author.save()
  }
  thread.author = author.id

  let catRes = getStringFromJson(args, "category")
  if (catRes.error == "none") { 
    let category = Category.load(catRes.data)
    if (category != null) { thread.category = catRes.data }
  }

  thread.deleted = false
  thread.createdAt = event.block.timestamp
  thread.save()

  let postId = id
  let post = new Post(postId)
  post.author = author.id

  let contentRes = getStringFromJson(args, "content")
  if (contentRes.error != "none") { log.warning(contentRes.error, []); return }
  post.content = contentRes.data
  
  post.thread = id
  post.deleted = false
  post.createdAt = event.block.timestamp
  post.save()
}

export function deleteThread(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let idRes = getStringFromJson(args, "id")
  if (idRes.error != "none") { log.warning(idRes.error, []); return }
  
  let thread = Thread.load(idRes.data)
  if (thread == null) { return }

  let forum = Forum.load(thread.forum)
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

  thread.deleted = true
  thread.deletedAt = event.block.timestamp
  thread.save()
}