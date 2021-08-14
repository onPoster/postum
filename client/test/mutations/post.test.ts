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
import { newForum, newThread, newPost, findForum } from "./utils"
chai.use(chaiAsPromised)

describe("Post mutations:", function () {
  this.timeout(20000)

  let signer: ethers.providers.JsonRpcSigner
  let forum: Forum
  let thread: Thread

  beforeEach(async () => {
    signer = await provider.getSigner()
    const createForum: schema.CREATE_FORUM = await newForum(signer)
    await delay(5000)
    forum = await findForum(createForum.args.title)
    // const createThread = await newThread(signer, forum)
    // await delay(5000)
  })

  describe("createPost", function () {
    it("makes a new post", async () => {

    })

    it("fails with invalid inputs: admins", async () => {

    })
  })
})