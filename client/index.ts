/**
 * this package should include:
 * - functions to create new postum actions like newForum(args)
 * - functions to query the subgraph 
 */

import * as mutate from "./mutations"
import * as query from "./queries"

export { Forum, Category, Thread, Post, AdminRole, User } from "./queries"
export default { mutate, query }