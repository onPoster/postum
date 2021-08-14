import { JSONValue, TypedMap, store, log } from "@graphprotocol/graph-ts"
import { NewPost } from "../../generated/Poster/Poster"
import { Forum, Thread, User, Post } from "../../generated/schema"

export function createPost(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let threadId = args.get("thread").toString()
  let thread = Thread.load(threadId)
  if (thread == null) { return }

  let l = thread.posts.length
  let postId = threadId + "-" + l.toString()
  let post = new Post(postId)

  let authorId = event.transaction.from.toHexString()
  let author = User.load(authorId)
  if (author == null) { 
    author = new User(authorId) 
    author.save()
  }
  post.author = author.id

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