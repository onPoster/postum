import { ethers } from "ethers"
import chai, { assert, expect } from "chai"
import chaiAsPromised from 'chai-as-promised'
import * as schema from "@postum/json-schema"
import client, { Post, Thread, Forum } from "../."
chai.use(chaiAsPromised)

export const provider = new ethers.providers.JsonRpcProvider()

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ==== mutations ====

export async function newForum(signer: ethers.Signer): Promise<schema.CREATE_FORUM> {
  const title: string = Date.now().toString() + " forum title"
  const newForum: schema.CREATE_FORUM = {
    action: "CREATE_FORUM",
    args: {
      title,
      admins: [await signer.getAddress()]
    }
  }
  await client.mutate.createForum(signer, newForum)
  return newForum
}

export async function newThread(signer: ethers.Signer, forum: Forum): Promise<schema.CREATE_THREAD> {
  const title: string = Date.now().toString() + " thread title"
  const content: string = Date.now().toString() + " post content"
  const newThread: schema.CREATE_THREAD = {
    action: "CREATE_THREAD",
    args: {
      forum: forum.id,
      title,
      content
    }
  }
  await client.mutate.createThread(signer, newThread)
  return newThread
}

export async function newPost(signer: ethers.Signer, thread: Thread): Promise<schema.CREATE_POST> {
  const content: string = Date.now().toString() + " post content"
  const newPost: schema.CREATE_POST = {
    action: "CREATE_POST",
    args: {
      thread: thread.id,
      reply_to_post: thread.posts[0].id,
      content
    }
  }
  await client.mutate.createPost(signer, newPost)
  return newPost
}

// ==== queries ====

export async function findForum(title: string): Promise<Forum> {
  const forums = await client.query.allForums(1000, 0)
  let res: Forum | boolean = false
  forums.forEach(forum => {
    if (forum.title == title) {
      res = forum
    }
  })
  if (res == false) { assert.equal(res, true, "no forum found") }
  return res as Forum
}

export async function findThreadInForum(title: string, forum: Forum): Promise<Thread> {
  const threads = await client.query.threadsByForum(forum.id, 1000, 0)
  let res: Thread | boolean = false
  threads.forEach(thread => {
    if (thread.title == title) {
      res = thread
    }
  })
  if (res == false) { assert.equal(res, true, "no thread found") }
  return res as Thread
}

export async function findPostInThread(content: string, thread: Thread): Promise<Post> {
  const posts = await client.query.postsByThread(thread.id, 1000, 0)
  let res: Post | boolean = false
  posts.forEach(post => {
    if (post.content == content) {
      res = post
    }
  })
  if (res == false) { assert.equal(res, true, "no post found") }
  return res as Post
}