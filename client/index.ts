/**
 * this package should include:
 * - functions to create new postum actions like newForum(args)
 * - functions to query the subgraph 
 */

import * as mutate from "./mutations/index"
import * as query from "./queries/index"

export { Forum, Category, Thread, Post, AdminRole, User } from "./queries/index"
export default { mutate, query }