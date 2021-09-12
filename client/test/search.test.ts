// Should test the search-based queries (postsBySearch)

import chai, { assert, expect } from "chai"
import chaiAsPromised from 'chai-as-promised'
import { actions } from "@postum/json-schema"
import { ethers } from "ethers"
import { 
  delay, 
  provider,
  newForum, 
  findForum,
  newThread,
  findThreadInForum,
  GRAPH_DELAY
} from "./utils"
import client, { returnTypes } from ".."
type Forum = returnTypes.Forum
type Thread = returnTypes.Thread
type Post = returnTypes.Post
chai.use(chaiAsPromised)

const SALT = Date.now().toString()
const source = "To vote with your feet, you must exit one system and enter a new one. If both are completely permissionless and frictionless, there will be no equilibrium, since the “richer” people will constantly leave their states and the “poorer” people will constantly follow them. No one wants this. There will obviously be some amount of friction because we live in the real world, which leads to an equilibrium like this: the richest people will seek out the states best for them, which likely means clustering together; those rich enough to follow them will follow, since those states offer the biggest benefits, until it is again better for the richest to leave (rich = some of wealthy, talented, skilled, etc.); those poor enough that they cannot overcome the friction of leaving and joining will be trapped in states with no resources, or in states that bring them in exploitively, or in no state at all. Again, this is not something anyone wants: it’s unstable at the top and bad for the bottom. This leads us to states that impose artificial friction on joining and leaving (i.e. permissioned states). Now, the rich can join states and prevent anyone they don’t wish to enter from joining, giving them more stability. However, the equilibrium here seems to be strict segregation by metaphorical “wealth” — people with things of value (resources, talent, skills, wealth) get let into correspondingly wealthy states, and there they are stuck unless they can acquire more wealth. This is the equilibrium we see today with neighborhoods and to a lesser degree nations, and this is why neighborhoods are basically strictly class-segregated. Wouldn’t this just lead to the same class warfare, extractive foreign capital, and tribalism/nationalism we see today? Actually, likely worse, since these systems are more difficult to regulate?"
const split = source.split(" ")
const postCount = Math.round(split.length / 6)
const posts = []
for (let i = 0; i <= postCount; i++) {
  const start = 6 * i
  const end = 6 * (i + 1)
  const a = split.slice(start, end)
  a.push(SALT)
  posts.push(a.join(" "))
}

/* Test not needed until some version of search is working */

describe("Query posts by text search", function () {
  this.timeout(20000)

  let signer: ethers.Signer
  let forum: Forum

  before(async () => {
    signer = await provider.getSigner()
    const createForum = await newForum(signer)
    await delay(GRAPH_DELAY)

    forum = await findForum(createForum.args.title)
    const threadTitle = "Thread for testing search"
    await newThread(signer, threadTitle, forum, null)
    await delay(GRAPH_DELAY)

    const thread: Thread = await findThreadInForum(threadTitle, forum)
    for (let i = 0; i < posts.length; i++) {
      const createPost: actions.CREATE_POST = {
        action: "CREATE_POST",
        args: {
          thread: thread.id,
          content: posts[i]
        }
      }
      await client.mutate.createPost(signer, createPost)
    }
    await delay(GRAPH_DELAY * 2)
  })

  it("finds the correct number of posts", async () => {
    const search1: Post[] = await client.query.postsBySearch("enter & " + SALT, 1000, 0)
    assert.equal(search1.length, 2, "search 1")

    const search2: Post[] = await client.query.postsBySearch("states & " + SALT, 1000, 0)
    assert.equal(search2.length, 10, "search 2")

    const search3: Post[] = await client.query.postsBySearch("one & system & " + SALT, 1000, 0)
    assert.equal(search3.length, 1, "search 3")

    /* The result of this "or" seems unpredictable for some reason
    const search4: Post[] = await client.query.postsBySearch("one & " + SALT + " | system & " + SALT, 1000, 0)
    assert.equal(search4.length, 3, "search 4")
    */

    const search5: Post[] = await client.query.postsBySearch("completely <-> permissionless & " + SALT, 1000, 0)
    assert.equal(search5.length, 1, "search 5")

    const search6: Post[] = await client.query.postsBySearch("permissionless <-> completely & " + SALT, 1000, 0)
    assert.equal(search6.length, 0, "search 6")

    const search7: Post[] = await client.query.postsBySearch("equ:* & " + SALT, 1000, 0)
    assert.equal(search7.length, 4, "search 7")
  })
})