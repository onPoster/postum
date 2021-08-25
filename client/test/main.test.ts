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
  newCategory,
  findCategory,
  newThread,
  findThreadInForum,
  newPost, 
  findPostInThread,
  GRAPH_DELAY
} from "./utils"
import client, { Forum, AdminRole, Category, Thread, Post } from ".."
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

function checkRemoveAdminRole(forum1: Forum, forum2: Forum, ar: schema.REMOVE_ADMIN_ROLE) {
  assert((() => {
    let res = false
    forum1.admin_roles.forEach(adminRole => {
      if (adminRole.user.id == ar.args.user) {
        res = true
      }
    })
    return res
  })(), "before remove")
  assert.equal(forum1.title, forum2.title, "forum title")
  assert.equal(forum1.id, forum2.id, "forum id")
  assert.deepEqual(forum1.categories, forum2.categories, "forum categories")
  assert.deepEqual(forum1.threads, forum2.threads, "forum threads")
  assert.isFalse((() => {
    let res = false
    forum2.admin_roles.forEach(adminRole => {
      if (adminRole.user.id == ar.args.user) {
        res = true
      }
    })
    return res
  })(), "after remove")
}

function checkCreateCategory(c1: schema.CREATE_CATEGORY, c2: Category) {
  assert.exists(c2.id, "category id")
  assert.equal(c2.forum.id, c1.args.forum, "category forum")
  assert.equal(c2.title, c1.args.title, "category title")
  assert.equal(c2.description, c1.args.description, "category description")
  assert.exists(c2.threads.length, "category threads")
}

function checkEditCategory(c1: schema.EDIT_CATEGORY, c2: Category, c3: Category) {
  assert.equal(c1.args.id, c3.id, "category ids 1")
  assert.equal(c1.args.title, c3.title, "category title")
  assert.equal(c1.args.description, c3.description, "category description")
  assert.equal(c2.id, c3.id, "category ids 2")
  assert.deepEqual(c2.forum, c3.forum, "category forum")
  assert.deepEqual(c2.threads, c3.threads, "category threads")
}

function checkCreateThread(t1: schema.CREATE_THREAD, t2: Thread, address: string) {
  assert.equal(t2.author.id, address, "thread author")
  if (t1.args.category) {
    assert.equal(t2.category.id, t1.args.category, "thread category")
  } else {
    assert.isFalse(!!t2.category, "thread category")
  }
  assert.equal(t2.forum.id, t1.args.forum, "thread forum")
  assert.exists(t2.id, "thread id")
  assert.equal(t2.posts.length, 1, "thread posts")
  assert.equal(t2.title, t1.args.title, "thread title")
}

function checkCreatePost(
  p1: schema.CREATE_POST, 
  p2: Post, 
  authorAddress: string, 
  thread: Thread
) {
  assert.equal(p2.content, p1.args.content, "post content")
  assert.exists(p2.id, "post id")
  assert.equal(p2.author.id, authorAddress.toLowerCase(), "post author")
  assert.isFalse(p2.deleted, "post deleted")
  assert.equal(p2.reply_to_post.id, thread.posts[0].id, "reply to post")
  assert.equal(p2.thread.id, thread.id, "post thread")
}

function checkEditPost(p1: Post, p2: schema.EDIT_POST, p3: Post) {
  assert.equal(p3.author.id, p1.author.id, "post author")
  assert.equal(p3.content, p2.args.content, "post content")
  assert.equal(p3.deleted, p1.deleted, "post deleted")
  if (p1.reply_to_post) {
    assert.equal(p3.reply_to_post.id, p1.reply_to_post.id, "post reply")
  }
  assert.equal(p3.id, p1.id, "post id")
  assert.equal(p3.thread.id, p1.thread.id, "post thread")
}

describe("Forum mutations:", function () {
  this.timeout(20000)

  let signer: ethers.providers.JsonRpcSigner
  let forum: Forum
  let category: Category
  let thread: Thread

  before(async () => {
    signer = await provider.getSigner()
  })

  describe("createForum", function () {
    it("makes a new forum", async () => {
      const createForum = await newForum(signer)
      await delay(GRAPH_DELAY)
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
      await delay(GRAPH_DELAY)
      const editedForum = await client.query.forum(forum.id)
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
      const beforeForum = await client.query.forum(forum.id)
      const title: string = Date.now().toString() + " EDITED forum title 💖"
      const editForum: schema.EDIT_FORUM = {
        action: "EDIT_FORUM",
        args: {
          id: forum.id,
          title
        }
      }
      await client.mutate.editForum(signer3, editForum)
      await delay(GRAPH_DELAY)
      const afterForum = await client.query.forum(forum.id)
      assert.deepEqual(beforeForum, afterForum)
    })
  })

  describe("deleteForum", function () {
    it("deletes a forum", async () => {
      const createForum = await newForum(signer)
      await delay(GRAPH_DELAY)
      const forum2 = await findForum(createForum.args.title)
      checkCreateForum(createForum, forum2)
      const deleteForum: schema.DELETE_FORUM = {
        action: "DELETE_FORUM",
        args: {
          id: forum2.id
        }
      }
      await client.mutate.deleteForum(signer, deleteForum)
      await delay(GRAPH_DELAY)
      await expect(client.query.forum(forum2.id))
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
      await delay(GRAPH_DELAY)
      const returnedForum = await client.query.forum(forum.id)
      assert.deepEqual(forum, returnedForum, "forum")
    })
  })

  describe("AdminRole mutations:", function () {
    let signer2: ethers.Signer

    describe("grantAdminRole", function () {
      it("creates a new admin role", async () => {
        signer2 = await provider.getSigner(1)
        const grantAdminRole = await newAdminRole(signer, signer2, forum)
        await delay(GRAPH_DELAY)
        const foundAdminRole = await findAdminRole(grantAdminRole)
        checkGrantAdminRole(grantAdminRole, foundAdminRole, forum)
      })

      it("fails with invalid inputs (forum id)", async () => {
        const newAdminRole: schema.GRANT_ADMIN_ROLE = {
          action: "GRANT_ADMIN_ROLE",
          args: {
            forum: "0xfllkajsdlfkj",
            user: await signer.getAddress()
          }
        }
        await expect(client.mutate.grantAdminRole(signer, newAdminRole))
          .to.be.rejectedWith(Error)
      })
  
      it("fails with invalid inputs (user id)", async () => {
        const newAdminRole: schema.GRANT_ADMIN_ROLE = {
          action: "GRANT_ADMIN_ROLE",
          args: {
            forum: forum.id,
            user: "0x12345aJ"
          }
        }
        await expect(client.mutate.grantAdminRole(signer, newAdminRole))
          .to.be.rejectedWith(Error)
      })

      it("is admin only", async () => {
        const signer3 = await provider.getSigner(2)
        const grantAdminRole = await newAdminRole(signer3, signer3, forum)
        await delay(GRAPH_DELAY)
        await expect(findAdminRole(grantAdminRole))
          .to.be.rejectedWith(Error)
      })
    })

    describe("removeAdminRole", function () {
      it("removes an admin role", async () => {
        forum = await client.query.forum(forum.id)
        const address = (await signer2.getAddress()).toLowerCase()
        const removeAdminRole: schema.REMOVE_ADMIN_ROLE = {
          action: "REMOVE_ADMIN_ROLE",
          args: {
            forum: forum.id,
            user: address
          }
        }
        await client.mutate.removeAdminRole(signer, removeAdminRole)
        await delay(GRAPH_DELAY)
        const foundForum = await client.query.forum(forum.id)
        checkRemoveAdminRole(forum, foundForum, removeAdminRole)
        forum = foundForum
      })

      it("fails with invalid inputs (forum id)", async () => {
        const address = (await signer.getAddress()).toLowerCase()
        const removeAdminRole: schema.REMOVE_ADMIN_ROLE = {
          action: "REMOVE_ADMIN_ROLE",
          args: {
            forum: forum.id + "P",
            user: address
          }
        }
        await expect(client.mutate.removeAdminRole(signer, removeAdminRole))
          .to.be.rejectedWith(Error)
      })

      it("fails with invalid inputs (user id)", async () => {
        const address = (await signer.getAddress()).toLowerCase()
        const removeAdminRole: schema.REMOVE_ADMIN_ROLE = {
          action: "REMOVE_ADMIN_ROLE",
          args: {
            forum: forum.id,
            user: address + "P"
          }
        }
        await expect(client.mutate.removeAdminRole(signer, removeAdminRole))
          .to.be.rejectedWith(Error)
      })
  
      it("is admin only", async () => {
        const signer3 = await provider.getSigner(2)
        const address = (await signer.getAddress()).toLowerCase()
        const removeAdminRole: schema.REMOVE_ADMIN_ROLE = {
          action: "REMOVE_ADMIN_ROLE",
          args: {
            forum: forum.id,
            user: address
          }
        }
        await client.mutate.removeAdminRole(signer3, removeAdminRole)
        await delay(GRAPH_DELAY)
        const foundForum = await client.query.forum(forum.id)
        assert.deepEqual(forum, foundForum)
      })
    })

    describe("Category mutations:", function () {
      let category2: Category

      describe("createCategory", function () {
        it("makes a new category", async () => {
          const cat1 = await newCategory(signer, forum, Date.now().toString() + " category title 💖")
          const cat2 = await newCategory(signer, forum, Date.now().toString() + " category title 2 💖")
          await delay(GRAPH_DELAY)
          category = await findCategory(cat1.args.title, forum)
          category2 = await findCategory(cat2.args.title, forum)
          checkCreateCategory(cat1, category)
          checkCreateCategory(cat2, category2)
        })
    
        it("fails with invalid inputs (forum id)", async () => {
          const newCategory: schema.CREATE_CATEGORY = {
            action: "CREATE_CATEGORY",
            args: {
              forum: "0x1lkjsdfljk2oij334234234jsdf",
              title: "Title",
              description: "Description"
            }
          }
          await expect(client.mutate.createCategory(signer, newCategory))
            .to.be.rejectedWith(Error)
        })
    
        it("is admin only", async () => {
          const signer2 = await provider.getSigner(1)
          const createCategory = await newCategory(signer2, forum, Date.now().toString() + " category title 2 💖")
          await delay(GRAPH_DELAY)
          await expect(findCategory(createCategory.args.title, forum))
            .to.be.rejectedWith(Error)
        })
      })

      describe("editCategory", function () {
        it("edits a category", async () => {
          const editCategory: schema.EDIT_CATEGORY = {
            action: "EDIT_CATEGORY",
            args: {
              id: category.id,
              title: Date.now().toString() + " edited category title 💖",
              description: "Edited description"
            }
          }
          await client.mutate.editCategory(signer, editCategory)
          await delay(GRAPH_DELAY)
          const foundCat = await findCategory(editCategory.args.title, forum)
          checkEditCategory(editCategory, category, foundCat)
          category = foundCat
        })
    
        it("fails with invalid inputs (category id)", async () => {
          const editCategory: schema.EDIT_CATEGORY = {
            action: "EDIT_CATEGORY",
            args: {
              id: "0x123456hjhj",
              title: Date.now().toString() + " edited category title 💖",
              description: "Edited description"
            }
          }
          await expect(client.mutate.editCategory(signer, editCategory))
            .to.be.rejectedWith(Error)
        })
    
        it("is admin only", async () => {
          const signer2 = await provider.getSigner(1)
          const editCategory: schema.EDIT_CATEGORY = {
            action: "EDIT_CATEGORY",
            args: {
              id: category.id,
              title: Date.now().toString() + " edited category title 💖",
              description: "Edited description"
            }
          }
          await client.mutate.editCategory(signer2, editCategory)
          await delay(GRAPH_DELAY)
          await expect(findCategory(editCategory.args.title, forum))
            .to.be.rejectedWith(Error)
        })
      })

      describe("deleteCategory", function () {
        it("deletes a category", async () => {
          assert.exists(await findCategory(category2.title, forum))
          const deleteCategory: schema.DELETE_CATEGORY = {
            action: "DELETE_CATEGORY",
            args: {
              id: category2.id
            }
          }
          await client.mutate.deleteCategory(signer, deleteCategory)
          await delay(GRAPH_DELAY)
          await expect(findCategory(category2.title, forum))
            .to.be.rejectedWith(Error)
        })
    
        it("fails with invalid inputs (category id)", async () => {
          const deleteCategory: schema.DELETE_CATEGORY = {
            action: "DELETE_CATEGORY",
            args: {
              id: category.id + "v"
            }
          }
          await expect(client.mutate.deleteCategory(signer, deleteCategory))
            .to.be.rejectedWith(Error)
        })
    
        it("is admin only", async () => {
          const signer2 = await provider.getSigner(1)
          const beforeCat = await findCategory(category.title, forum)
          const deleteCategory: schema.DELETE_CATEGORY = {
            action: "DELETE_CATEGORY",
            args: {
              id: category.id
            }
          }
          await client.mutate.deleteCategory(signer2, deleteCategory)
          await delay(GRAPH_DELAY)
          const afterCat = await findCategory(category.title, forum)
          assert.deepEqual(beforeCat, afterCat)
        })
      })

      describe("Thread mutations:", async () => {
        let thread2: Thread

        describe("createThread", function () {
          it("creates a thread w/ category", async () => {
            const title = Date.now().toString() + " thread title w/ CAT💖"
            const createThread = await newThread(signer, title, forum, category)
            await delay(GRAPH_DELAY)
            const foundThread = await findThreadInForum(title, forum)
            const address = (await signer.getAddress()).toLowerCase()
            checkCreateThread(createThread, foundThread, address)
            thread = foundThread
          })

          it("creates a thread w/out category", async () => {
            const title = Date.now().toString() + " thread title 💖"
            const createThread = await newThread(signer, title, forum, null)
            await delay(GRAPH_DELAY)
            const foundThread = await findThreadInForum(title, forum)
            const address = (await signer.getAddress()).toLowerCase()
            checkCreateThread(createThread, foundThread, address)
            thread2 = foundThread
          })
      
          it("fails with invalid inputs (forum id)", async () => {
            const createThread: schema.CREATE_THREAD = {
              action: "CREATE_THREAD",
              args: {
                forum: "0x1235jhdf",
                category: category.id,
                title: "Title",
                content: "Content"
              }
            }
            await expect(client.mutate.createThread(signer, createThread))
              .to.be.rejectedWith(Error)
          })

          it("fails with invalid inputs (category id)", async () => {
            const createThread: schema.CREATE_THREAD = {
              action: "CREATE_THREAD",
              args: {
                forum: forum.id,
                category: category.id + "5",
                title: "Title",
                content: "Content"
              }
            }
            await expect(client.mutate.createThread(signer, createThread))
              .to.be.rejectedWith(Error)
          })
        })

        describe("deleteThread", function () {
          it("deletes a thread", async () => {
            assert.exists(await findThreadInForum(thread2.title, forum))
            const deleteThread: schema.DELETE_THREAD = {
              action: "DELETE_THREAD",
              args: {
                id: thread2.id
              }
            }
            await client.mutate.deleteThread(signer, deleteThread)
            await delay(GRAPH_DELAY)
            await expect(findThreadInForum(thread2.title, forum))
              .to.be.rejectedWith(Error)
          })
      
          it("fails with invalid inputs (thread id)", async () => {
            assert.exists(await findThreadInForum(thread.title, forum))
            const deleteThread: schema.DELETE_THREAD = {
              action: "DELETE_THREAD",
              args: {
                id: thread.id + "O"
              }
            }
            await expect(client.mutate.deleteThread(signer, deleteThread))
              .to.be.rejectedWith(Error)
          })
      
          it("is admin only", async () => {
            const signer2 = await provider.getSigner(1)
            const beforeThread = await findThreadInForum(thread.title, forum)
            const deleteThread: schema.DELETE_THREAD = {
              action: "DELETE_THREAD",
              args: {
                id: thread.id
              }
            }
            await client.mutate.deleteThread(signer2, deleteThread)
            await delay(GRAPH_DELAY)
            const afterThread = await findThreadInForum(thread.title, forum)
            assert.deepEqual(beforeThread, afterThread)
          })
        })

        describe("Post mutations:", function () {
          let post: Post
          let signer3: ethers.Signer

          describe("createPost", function () {
            it("makes a new post", async () => {
              signer3 = await provider.getSigner(2)
              thread = await findThreadInForum(thread.title, forum)
              const createPost = await newPost(signer3, thread)
              await delay(GRAPH_DELAY)
              post = await findPostInThread(createPost.args.content, thread)
              checkCreatePost(createPost, post, await signer3.getAddress(), thread)
            })
        
            it("fails with invalid inputs (thread id)", async () => {
              const createPost: schema.CREATE_POST = {
                action: "CREATE_POST",
                args: {
                  thread: thread.id + "K",
                  reply_to_post: thread.posts[0].id,
                  content: "Content"
                }
              }
              await expect(client.mutate.createPost(signer3, createPost))
                .to.be.rejectedWith(Error)
            })

            it("fails with invalid inputs (reply id)", async () => {
              const createPost: schema.CREATE_POST = {
                action: "CREATE_POST",
                args: {
                  thread: thread.id,
                  reply_to_post: "0xFGRle93",
                  content: "Content"
                }
              }
              await expect(client.mutate.createPost(signer3, createPost))
                .to.be.rejectedWith(Error)
            })
          })

          describe("editPost", function () {
            it("edits a post", async () => {
              const beforePost = await findPostInThread(post.content, thread)
              const editPost: schema.EDIT_POST = {
                action: "EDIT_POST",
                args: {
                  id: post.id,
                  content: Date.now().toString() + " post content from AUTHOR EDIT POST"
                }
              }
              await client.mutate.editPost(signer3, editPost)
              await delay(GRAPH_DELAY)
              const afterPost = await findPostInThread(editPost.args.content, thread)
              checkEditPost(beforePost, editPost, afterPost)
              post = afterPost
            })
        
            it("fails with invalid inputs (post id)", async () => {
              const editPost: schema.EDIT_POST = {
                action: "EDIT_POST",
                args: {
                  id: post.id + "1",
                  content: "Content"
                }
              }
              await expect(client.mutate.editPost(signer, editPost))
                .to.be.rejectedWith(Error)
            })
        
            it("is author only", async () => {
              const editPost: schema.EDIT_POST = {
                action: "EDIT_POST",
                args: {
                  id: post.id,
                  content: Date.now().toString() + " post content from ADMIN EDIT POST"
                }
              }
              await client.mutate.editPost(signer, editPost)
              await delay(GRAPH_DELAY)
              await expect(findPostInThread(editPost.args.content, thread))
                .to.be.rejectedWith(Error)
            })
          })

          describe("deletePost", function () {
            let post2: Post
            let post3: Post

            before(async () => {
              thread = await findThreadInForum(thread.title, forum)
              const createPost2 = await newPost(signer, thread)
              const createPost3 = await newPost(signer, thread)
              await delay(GRAPH_DELAY)
              post2 = await findPostInThread(createPost2.args.content, thread)
              checkCreatePost(createPost2, post2, await signer.getAddress(), thread)
              post3 = await findPostInThread(createPost3.args.content, thread)
              checkCreatePost(createPost3, post3, await signer.getAddress(), thread)
            })

            it("deletes a post (author)", async () => {
              const deletePost: schema.DELETE_POST = {
                action: "DELETE_POST",
                args: {
                  id: post.id
                }
              }
              await client.mutate.deletePost(signer3, deletePost)
              await delay(GRAPH_DELAY)
              await expect(findPostInThread(post.content, thread))
                .to.be.rejectedWith(Error)
            })

            it("deletes a post (admin)", async () => {
              const deletePost: schema.DELETE_POST = {
                action: "DELETE_POST",
                args: {
                  id: post2.id
                }
              }
              await client.mutate.deletePost(signer, deletePost)
              await delay(GRAPH_DELAY)
              await expect(findPostInThread(post2.content, thread))
                .to.be.rejectedWith(Error)
            })
        
            it("fails with invalid inputs (post id)", async () => {
              const deletePost: schema.DELETE_POST = {
                action: "DELETE_POST",
                args: {
                  id: "0x2343434AAA"
                }
              }
              await expect(client.mutate.deletePost(signer, deletePost))
                .to.be.rejectedWith(Error)
            })
        
            it("is admin or author only", async () => {
              const beforePost = await findPostInThread(post3.content, thread)
              const signer2 = await provider.getSigner(1)
              const deletePost: schema.DELETE_POST = {
                action: "DELETE_POST",
                args: {
                  id: post3.id
                }
              }
              await client.mutate.deletePost(signer2, deletePost)
              await delay(GRAPH_DELAY)
              const afterPost = await findPostInThread(post3.content, thread)
              assert.deepEqual(beforePost, afterPost)
            })
          })
        })
      })
    })
  }) 
})