import { ethers } from "ethers"
import * as schema from "@postum/json-schema"
import { createForum } from "../mutations/forum"
import { allForums } from "../queries/forum"

const provider = new ethers.providers.JsonRpcProvider()

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  const signer = await provider.getSigner()
  const newForum: schema.CREATE_FORUM = {
    action: "CREATE_FORUM",
    args: {
      title: "New Forum",
      admins: [await signer.getAddress()]
    }
  }
  await createForum(signer, newForum)
  await delay(5000)
  const forums = await allForums(10, 0)
  console.log("Forums:", forums)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

/**
 * TODO spec tests:
 * - for all
 *  - valid inputs produce expected result
 *  - invalid inputs do not
 * 
 * mutations
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
 * 
 * queries
 * - 
 * 
 * TODO add testing libs
 */