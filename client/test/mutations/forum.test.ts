import chai, { assert, expect } from "chai"
import chaiAsPromised from 'chai-as-promised'
import * as schema from "@postum/json-schema"
import { ethers } from "ethers"
import { delay, provider } from "../utils"
import client, { Forum } from "../../."
import { newForum, findForum } from "./utils"
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

describe("Forum mutations:", function () {
  this.timeout(10000)

  let signer: ethers.providers.JsonRpcSigner

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
})