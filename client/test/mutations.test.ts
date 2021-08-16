/**
 * TODO spec tests:
 * 
 * mutations
 *  - for all
 *  - valid inputs produce expected result
 *  - invalid inputs do not
 * 
 * - Forum
 *  - createForum
 *  - editForum
 *    - admin only
 *  - deleteForum 
 *    - admin only
 * - Category
 *  - createCategory
 *    - admin only
 *  - editCategory
 *    - admin only
 *  - deleteCategory
 *    - admin only
 * - Thread
 *  - createThread
 *  - deleteThread
 *    - admin only
 * - Post
 *  - createPost
 *  - editPost
 *    - post author only
 *  - deletePost
 *    - admin or post author only
 * - AdminRole
 *  - grantAdminRole
 *    - admin only
 *  - removeAdminRole
 *    - admin only
 */

import chai, { assert, expect } from "chai"
import chaiAsPromised from 'chai-as-promised'
import * as schema from "@postum/json-schema"
import { ethers } from "ethers"
import { 
  delay, 
  provider,
  newForum, 
  findForum, 
  newThread,
  findThreadInForum,
  newPost, 
  findPostInThread
} from "./utils"
import client, { Forum, Thread, Post } from ".."
chai.use(chaiAsPromised)

function checkCreateForum(f1: schema.CREATE_FORUM, f2: Forum) {
  assert.equal(f2.title, f1.args.title, "forum title")
  assert(!!f2.id, "forum id")
  assert.equal(
    f2.admin_roles[0].id, 
    f2.id + "-" + f1.args.admins[0],
    "forum admin id"
  )
}

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

describe("Forum mutations:", function () {
  this.timeout(20000)

  let signer: ethers.providers.JsonRpcSigner
  let forum: Forum
  let thread: Thread

  before(async () => {
    signer = await provider.getSigner()
  })

  describe("createForum", function () {
    it("makes a new forum", async () => {
      const createForum = await newForum(signer)
      await delay(5000)
      const foundForum = await findForum(createForum.args.title)
      checkCreateForum(createForum, foundForum)
    })

    it("fails with invalid inputs: admins", async () => {
      const title: string = Date.now().toString()
      const createForum: schema.CREATE_FORUM = {
        action: "CREATE_FORUM",
        args: {
          title,
          admins: ["random string"]
        }
      }
      expect(client.mutate.createForum(signer, createForum))
        .to.be.rejectedWith(Error)
    })
  })

  describe("AdminRole mutations:", function () {
    before(async () => {
      const createForum = await newForum(signer)
      await delay(5000)
      forum = await findForum(createForum.args.title)
    })

    describe("Category mutations:", function () {
      before(async () => {

      })

      describe("Thread mutations:", async () => {
        before(async () => {
          // create Category
        })

        describe("Post mutations:", function () {
          before(async () => {
            const createThread = await newThread(signer, forum)
            await delay(5000)
            thread = await findThreadInForum(createThread.args.title, forum)
          })
        
          describe("createPost", function () {
            it("makes a new post", async () => {
              const createPost = await newPost(signer, thread)
              await delay(5000)
              const post = await findPostInThread(createPost.args.content, thread)
              checkCreatePost(createPost, post, await signer.getAddress(), thread)
            })
        
            it("fails with invalid inputs: admins", async () => {
        
            })
          })
        })
      })
    })
  }) 
})