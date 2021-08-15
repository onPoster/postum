import { JSONValue, JSONValueKind, TypedMap, store, log } from "@graphprotocol/graph-ts"
import { NewPost } from "../../generated/Poster/Poster"
import { Forum, Thread, User, Post } from "../../generated/schema"

export function createPost(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let threadId = args.get("thread").toString()
  let thread = Thread.load(threadId)
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

  let replyJSON = args.get("reply_to_post")
  if (replyJSON.kind == JSONValueKind.STRING) {
    let replyId = replyJSON.toString()
    let replyToPost = Post.load(replyId)
    if (replyToPost != null) { post.reply_to_post = replyId }
  }

  post.content = args.get("content").toString()
  post.thread = threadId
  post.deleted = false
  post.save()
}

export function editPost(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = args.get("id").toString()
  let post = Post.load(id)
  if (post == null) { return }

  if (event.transaction.from.toHexString() == post.author) {
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

  post.content = args.get("content").toString()
  post.save()
}

export function deletePost(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = args.get("id").toString()
  let post = Post.load(id)
  if (post == null) { return }

  let thread = Thread.load(post.thread)
  if (thread == null) { return }

  let forum = Forum.load(thread.forum)
  if (forum == null) { return }

  if (
    !forum.admin_roles.includes(event.transaction.from.toHexString()) ||
    event.transaction.from.toHexString() == post.author
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