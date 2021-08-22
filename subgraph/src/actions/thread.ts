import { JSONValue, TypedMap, store, log, JSONValueKind } from "@graphprotocol/graph-ts"
import { NewPost } from "../../generated/Poster/Poster"
import { Forum, AdminRole, Category, Thread, User, Post } from "../../generated/schema"

export function createThread(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let forumIdValue = args.get("forum")
  if (forumIdValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'forum' field", [])
    return 
  }
  let forumId = forumIdValue.toString()
  let forum = Forum.load(forumId)
  if (forum == null) { return }

  let id = event.transaction.hash.toHexString()
  let thread = new Thread(id)
  thread.forum = forumId

  let titleValue = args.get("title")
  if (titleValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'title' field", [])
    return 
  }
  thread.title = titleValue.toString()

  let authorId = event.transaction.from.toHexString()
  let author = User.load(authorId)
  if (author == null) { 
    author = new User(authorId) 
    author.save()
  }
  thread.author = author.id

  let categoryJSON = args.get("category")
  if (categoryJSON.kind == JSONValueKind.STRING) {
    let categoryId = categoryJSON.toString()
    let category = Category.load(categoryId)
    if (category != null) { thread.category = categoryId }
  }
  thread.deleted = false

  thread.save()

  let postId = id
  let post = new Post(postId)
  post.author = author.id

  let contentValue = args.get("content")
  if (contentValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'content' field", [])
    return 
  }
  post.content = contentValue.toString()
  post.thread = id
  post.deleted = false

  post.save()
}

export function deleteThread(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let idValue = args.get("id")
  if (idValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'id' field", [])
    return 
  }
  let id = idValue.toString()
  
  let thread = Thread.load(id)
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
  thread.save()
}