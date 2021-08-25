import { ethers } from "ethers"
import chai, { assert, expect } from "chai"
import chaiAsPromised from 'chai-as-promised'
import * as schema from "@postum/json-schema"
import client, { Forum, Category, Post, Thread } from "../."
import { AdminRole } from "../queries";
chai.use(chaiAsPromised)

export const provider = new ethers.providers.JsonRpcProvider()

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const GRAPH_DELAY = 1000

// ==== mutations ====

export async function newForum(signer: ethers.Signer): Promise<schema.CREATE_FORUM> {
  const title: string = Date.now().toString() + " forum title 💖"
  const newForum: schema.CREATE_FORUM = {
    action: "CREATE_FORUM",
    args: {
      title,
      admins: [(await signer.getAddress()).toLowerCase()]
    }
  }
  await client.mutate.createForum(signer, newForum)
  return newForum
}

export async function newAdminRole(
  signer: ethers.Signer, 
  signer2: ethers.Signer, 
  forum: Forum
): Promise<schema.GRANT_ADMIN_ROLE> {
  const newAdminRole: schema.GRANT_ADMIN_ROLE = {
    action: "GRANT_ADMIN_ROLE",
    args: {
      forum: forum.id,
      user: (await signer2.getAddress()).toLowerCase()
    }
  }
  await client.mutate.grantAdminRole(signer, newAdminRole)
  return newAdminRole
}

export async function newCategory(signer: ethers.Signer, forum: Forum, title: string): Promise<schema.CREATE_CATEGORY> {
  const newCategory: schema.CREATE_CATEGORY = {
    action: "CREATE_CATEGORY",
    args: {
      forum: forum.id,
      title,
      description: "Stock description 🏐"
    }
  }
  await client.mutate.createCategory(signer, newCategory)
  return newCategory
}

export async function newThread(
  signer: ethers.Signer, 
  title: string, 
  forum: Forum,
  category: Category | null
): Promise<schema.CREATE_THREAD> {
  const content: string = Date.now().toString() + " post content from NEW THREAD 💖"
  const newThread: schema.CREATE_THREAD = {
    action: "CREATE_THREAD",
    args: {
      forum: forum.id,
      title,
      content
    }
  }
  if (category) { 
    newThread.args.category = category.id 
    newThread.args.content += "W/ CAT"
  }
  await client.mutate.createThread(signer, newThread)
  return newThread
}

export async function newPost(signer: ethers.Signer, thread: Thread): Promise<schema.CREATE_POST> {
  const content: string = Date.now().toString() + " post content from NEW POST"
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
  let res: Forum | false = false
  forums.forEach(forum => {
    if (forum.title == title) {
      res = forum
    }
  })
  if (res == false) { assert.equal(res, true, "no forum found") }
  return res as Forum
}

export async function findAdminRole(adminRole: schema.GRANT_ADMIN_ROLE): Promise<AdminRole> {
  const admins = await client.query.adminsByForum(adminRole.args.forum, 1000, 0)
  let res: AdminRole | false = false
  admins.forEach(admin => {
    if (admin.user.id == adminRole.args.user) {
      res = admin
    }
  })
  if (res == false) { assert.equal(res, true, "no admin role found") }
  return res as AdminRole
}

export async function findCategory(title: string, forum: Forum): Promise<Category> {
  const categories = await client.query.categoriesByForum(forum.id, 100, 0)
  let res: Category | false = false
  categories.forEach(cat => {
    if (cat.title == title) {
      res = cat
    }
  })
  if (res == false) { assert.equal(res, true, "no category found") }
  return res as Category
}

export async function findThreadInForum(title: string, forum: Forum): Promise<Thread> {
  const threads = await client.query.threadsByForum(forum.id, 1000, 0)
  let res: Thread | false = false
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
  let res: Post | false = false
  posts.forEach(post => {
    if (post.content == content) {
      res = post
    }
  })
  if (res == false) { assert.equal(res, true, "no post found") }
  return res as Post
}