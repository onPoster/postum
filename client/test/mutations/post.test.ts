/**
 * - Post
 *  - createPost
 *    - valid inputs produce expected result
 *    - invalid inputs do not
 *  - editPost
 *    - post author only
 *  - deletePost
 *    - admin or post author only
 */

import chai, { assert, expect } from "chai"
import chaiAsPromised from 'chai-as-promised'
import * as schema from "@postum/json-schema"
import { ethers } from "ethers"
import { delay, provider } from "../utils"
import client, { Post, Thread, Forum } from "../../."
import { newForum, newThread, newPost, findForum, findThreadInForum, findPostInThread } from "./utils"
chai.use(chaiAsPromised)

function checkCreatePost(
  f1: schema.CREATE_POST, 
  f2: Post, 
  authorAddress: string, 
  thread: Thread
) {
  assert.equal(f2.content, f1.args.content, "post content")
  assert(!!f2.id, "post id")
  assert.equal(f2.author.id, authorAddress.toLowerCase(), "post author")
  assert(!f2.deleted, "post deleted")
  assert.equal(f2.reply_to_post.id, thread.posts[0].id, "reply to post")
  assert.equal(f2.thread.id, thread.id, "post thread")
}

describe("Post mutations:", function () {
  this.timeout(20000)

  let signer: ethers.providers.JsonRpcSigner
  let forum: Forum
  let thread: Thread

  before(async () => {
    signer = await provider.getSigner()
    const createForum = await newForum(signer)
    await delay(5000)
    console.log("finding forum")
    forum = await findForum(createForum.args.title)
    const createThread = await newThread(signer, forum)
    await delay(5000)
    console.log("finding thread")
    thread = await findThreadInForum(createThread.args.title, forum)
  })

  describe("createPost", function () {
    it("makes a new post", async () => {
      const createPost = await newPost(signer, thread)
      await delay(5000)
      console.log("finding post")
      const post = await findPostInThread(createPost.args.content, thread)
      console.log("POST", post)
      checkCreatePost(createPost, post, await signer.getAddress(), thread)
    })

    it("fails with invalid inputs: admins", async () => {

    })
  })
})