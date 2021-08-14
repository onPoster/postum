import { JSONValue, TypedMap, store, log } from "@graphprotocol/graph-ts"
import { NewPost } from "../../generated/Poster/Poster"
import { Forum, Category, Thread, User, Post } from "../../generated/schema"

export function createThread(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let forumId = args.get("forum").toString()
  let forum = Forum.load(forumId)
  if (forum == null) { return }

  let id = event.transaction.hash.toHexString()
  let thread = new Thread(id)
  thread.forum = forumId
  thread.title = args.get("title").toString()

  let authorId = event.transaction.from.toHexString()
  let author = User.load(authorId)
  if (author == null) { author = new User(authorId) }
  thread.author = author.id

  let categoryId = args.get("category").toString()
  let category = Category.load(categoryId)
  if (category != null) { thread.category = categoryId }

  thread.save()
  
  let l = thread.posts.length
  let postId = id + "-" + l.toString()
  let post = new Post(postId)
  post.author = author.id
  post.content = args.get("content").toString()
  post.thread = id
  post.deleted = false
  post.save()
}

export function deleteThread(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = args.get("id").toString()
  let thread = Thread.load(id)
  if (thread == null) { return }

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

  store.remove("Thread", id)
}