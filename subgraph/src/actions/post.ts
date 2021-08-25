import { JSONValue, TypedMap, log } from "@graphprotocol/graph-ts"
import { NewPost } from "../../generated/Poster/Poster"
import { Forum, AdminRole, Thread, User, Post } from "../../generated/schema"
import { getStringFromJson } from "../utils"

export function createPost(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let threadRes = getStringFromJson(args, "thread")
  if (threadRes.error != "none") { log.warning(threadRes.error, []); return }

  let thread = Thread.load(threadRes.data)
  if (thread == null) { return }

  let postId = event.transaction.hash.toHexString()
  let post = new Post(postId)

  let authorId = event.transaction.from.toHexString()
  let author = User.load(authorId)
  if (author == null) { 
    author = new User(authorId) 
    author.save()
  }
  post.author = author.id

  let replyRes = getStringFromJson(args, "reply_to_post")
  if (replyRes.error == "none") { 
    let replyToPost = Post.load(replyRes.data)
    if (replyToPost != null) { post.reply_to_post = replyRes.data }
  }

  let contentRes = getStringFromJson(args, "content")
  if (contentRes.error != "none") { log.warning(contentRes.error, []); return }
  post.content = contentRes.data

  post.thread = thread.id
  post.deleted = false

  post.save()
}

export function editPost(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let idRes = getStringFromJson(args, "id")
  if (idRes.error != "none") { log.warning(idRes.error, []); return }

  let post = Post.load(idRes.data)
  if (post == null) { return }

  if (event.transaction.from.toHexString() != post.author) {
    log.error(
      "Permissions: {} not author of post {} (author: {})",
      [
        event.transaction.from.toHexString(),
        post.id,
        post.author
      ]
    )
    return
  }

  let contentRes = getStringFromJson(args, "content")
  if (contentRes.error != "none") { log.warning(contentRes.error, []); return }
  post.content = contentRes.data

  post.save()
}

export function deletePost(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let idRes = getStringFromJson(args, "id")
  if (idRes.error != "none") { log.warning(idRes.error, []); return }

  let post = Post.load(idRes.data)
  if (post == null) { return }

  let thread = Thread.load(post.thread)
  if (thread == null) { return }

  let forum = Forum.load(thread.forum)
  if (forum == null) { return }

  let senderAdminRole = AdminRole.load(forum.id + "-" + event.transaction.from.toHexString())
  if (
    (senderAdminRole == null || senderAdminRole.deleted == true) &&
    event.transaction.from.toHexString() != post.author
  ) {
    log.error(
      "Permissions: {} not an admin in forum {} or author of post {} (author: {})",
      [
        event.transaction.from.toHexString(),
        forum.id,
        post.id,
        post.author
      ]
    )
    return
  }

  post.deleted = true
  post.save()
}