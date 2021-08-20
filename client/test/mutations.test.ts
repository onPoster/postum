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
  newAdminRole, 
  findAdminRole,
  newThread,
  findThreadInForum,
  newPost, 
  findPostInThread
} from "./utils"
import client, { Forum, AdminRole, Thread, Post } from ".."
chai.use(chaiAsPromised)

function checkCreateForum(f1: schema.CREATE_FORUM, f2: Forum) {
  assert.equal(f2.title, f1.args.title, "forum title")
  assert.exists(f2.id, "forum id")
  assert.equal(
    f2.admin_roles[0].id, 
    f2.id + "-" + f1.args.admins[0],
    "forum admin id"
  )
}

function checkEditForum(f0: Forum, f1: schema.EDIT_FORUM, f2: Forum) {
  assert.equal(f2.title, f1.args.title, "forum title")
  assert.exists(f2.id, "forum id")
  assert.deepEqual<AdminRole[]>(f0.admin_roles, f2.admin_roles, "forum admins")
}

function checkGrantAdminRole(ar1: schema.GRANT_ADMIN_ROLE, ar2: AdminRole, forum: Forum) {
  assert.exists(ar2.id, "admin role id")
  assert.equal(forum.id, ar1.args.forum, "admin role forum id")
  assert.equal(ar2.user.id, ar1.args.user, "admin role user id")
}

function checkCreatePost(
  f1: schema.CREATE_POST, 
  f2: Post, 
  authorAddress: string, 
  thread: Thread
) {
  assert.equal(f2.content, f1.args.content, "post content")
  assert.exists(f2.id, "post id")
  assert.equal(f2.author.id, authorAddress.toLowerCase(), "post author")
  assert.isFalse(f2.deleted, "post deleted")
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
      forum = await findForum(createForum.args.title)
      checkCreateForum(createForum, forum)
    })

    it("fails with invalid inputs (admins)", async () => {
      const title: string = Date.now().toString()
      const createForum: schema.CREATE_FORUM = {
        action: "CREATE_FORUM",
        args: {
          title,
          admins: ["random string"]
        }
      }
      await expect(client.mutate.createForum(signer, createForum))
        .to.be.rejectedWith(Error)
    })
  })

  describe("editForum", function () {
    it("edits a forum", async () => {
      const title: string = Date.now().toString() + " EDITED forum title 💖"
      const editForum: schema.EDIT_FORUM = {
        action: "EDIT_FORUM",
        args: {
          id: forum.id,
          title
        }
      }
      await client.mutate.editForum(signer, editForum)
      await delay(5000)
      const editedForum = await findForum(title)
      checkEditForum(forum, editForum, editedForum)
      forum = editedForum
    })

    it("fails with invalid inputs (id)", async () => {
      const title: string = Date.now().toString() + " EDITED forum title 💖"
      const editForum: schema.EDIT_FORUM = {
        action: "EDIT_FORUM",
        args: {
          id: "0x12345",
          title
        }
      }
      await expect(client.mutate.editForum(signer, editForum))
        .to.be.rejectedWith(Error)
    })

    it("is admin only", async () => {
      const signer3 = await provider.getSigner(2)
      const title: string = Date.now().toString() + " EDITED forum title 💖"
      const editForum: schema.EDIT_FORUM = {
        action: "EDIT_FORUM",
        args: {
          id: forum.id,
          title
        }
      }
      await client.mutate.editForum(signer3, editForum)
      await delay(5000)
      await expect(findForum(title))
        .to.be.rejectedWith(Error)
    })
  })

  describe("deleteForum", function () {
    it("deletes a forum", async () => {
      const createForum = await newForum(signer)
      await delay(5000)
      const forum2 = await findForum(createForum.args.title)
      checkCreateForum(createForum, forum2)
      const deleteForum: schema.DELETE_FORUM = {
        action: "DELETE_FORUM",
        args: {
          id: forum2.id
        }
      }
      await client.mutate.deleteForum(signer, deleteForum)
      await delay(5000)
      await expect(findForum(forum2.title))
        .to.be.rejectedWith(Error)
    })

    it("fails with invalid inputs (id)", async () => {
      const deleteForum: schema.DELETE_FORUM = {
        action: "DELETE_FORUM",
        args: {
          id: "0x12345"
        }
      }
      await expect(client.mutate.deleteForum(signer, deleteForum))
        .to.be.rejectedWith(Error)
    })

    it("is admin only", async () => {
      const signer3 = provider.getSigner(2)
      const deleteForum: schema.DELETE_FORUM = {
        action: "DELETE_FORUM",
        args: {
          id: forum.id
        }
      }
      await client.mutate.deleteForum(signer3, deleteForum)
      await delay(5000)
      const returnedForum = await findForum(forum.title)
      assert.deepEqual(forum, returnedForum, "forum")
    })
  })

  describe("AdminRole mutations:", function () {
    /*
    before(async () => {
      const createForum = await newForum(signer)
      await delay(5000)
      forum = await findForum(createForum.args.title)
    })
    */

    describe("grantAdminRole", function () {
      it("creates a new admin role", async () => {
        const signer2 = await provider.getSigner(1)
        const grantAdminRole = await newAdminRole(signer, signer2, forum)
        await delay(5000)
        const foundAdminRole = await findAdminRole(grantAdminRole)
        checkGrantAdminRole(grantAdminRole, foundAdminRole, forum)
      })
  
      it.skip("fails with invalid inputs", async () => {
        
      })

      it("is admin only", async () => {
        const signer3 = await provider.getSigner(2)
        const grantAdminRole = await newAdminRole(signer3, signer3, forum)
        await delay(5000)
        await expect(findAdminRole(grantAdminRole))
          .to.be.rejectedWith(Error)
      })
    })

    describe("removeAdminRole", function () {
      it.skip("removes an admin role", async () => {

      })

      it.skip("fails with invalid inputs", async () => {

      })
  
      it.skip("is admin only", async () => {
  
      })
    })

    describe("Category mutations:", function () {
      before(async () => {
        
      })

      describe("createCategory", function () {
        it.skip("makes a new category", async () => {

        })
    
        it.skip("fails with invalid inputs", async () => {
    
        })
    
        it.skip("is admin only", async () => {
    
        })
      })

      describe("editCategory", function () {
        it.skip("edits a category", async () => {

        })
    
        it.skip("fails with invalid inputs", async () => {
    
        })
    
        it.skip("is admin only", async () => {
    
        })
      })

      describe("deleteCategory", function () {
        it.skip("deletes a category", async () => {

        })
    
        it.skip("fails with invalid inputs", async () => {
    
        })
    
        it.skip("is admin only", async () => {
    
        })
      })

      describe("Thread mutations:", async () => {
        before(async () => {
          // create Category
        })

        describe("createThread", function () {
          it.skip("deletes a thread", async () => {

          })
      
          it.skip("fails with invalid inputs", async () => {
      
          })
        })

        describe("deleteThread", function () {
          it.skip("deletes a thread", async () => {

          })
      
          it.skip("fails with invalid inputs", async () => {
      
          })
      
          it.skip("is admin only", async () => {
      
          })
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
        
            it.skip("fails with invalid inputs", async () => {
        
            })
          })

          describe("editPost", function () {
            it.skip("edits a post (author)", async () => {

            })

            it.skip("edits a post (admin)", async () => {

            })
        
            it.skip("fails with invalid inputs", async () => {
        
            })
        
            it.skip("is admin or author only", async () => {
        
            })
          })

          describe("deletePost", function () {
            // Posts aren't actually removed from the subgraph, just marked "deleted" (unlike other entities)
            it.skip("deletes a post (author)", async () => {

            })

            it.skip("deletes a post (admin)", async () => {

            })
        
            it.skip("fails with invalid inputs", async () => {
        
            })
        
            it.skip("is admin or author only", async () => {
        
            })
          })
        })
      })
    })
  }) 
})