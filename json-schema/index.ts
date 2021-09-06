import * as schema from "./schema.js"
import * as ajvValidate from "./generated/validate.js"
import { CREATE_CATEGORY } from "./generated/types/CREATE_CATEGORY"
import { CREATE_FORUM } from "./generated/types/CREATE_FORUM"
import { CREATE_POST } from "./generated/types/CREATE_POST"
import { CREATE_THREAD } from "./generated/types/CREATE_THREAD"
import { DELETE_CATEGORY } from "./generated/types/DELETE_CATEGORY"
import { DELETE_FORUM } from "./generated/types/DELETE_FORUM"
import { DELETE_POST } from "./generated/types/DELETE_POST"
import { DELETE_THREAD } from "./generated/types/DELETE_THREAD"
import { EDIT_CATEGORY } from "./generated/types/EDIT_CATEGORY"
import { EDIT_FORUM } from "./generated/types/EDIT_FORUM"
import { EDIT_POST } from "./generated/types/EDIT_POST"
import { GRANT_ADMIN_ROLE } from "./generated/types/GRANT_ADMIN_ROLE"
import { POSTUM_ACTION } from "./generated/types/POSTUM_ACTION"
import { REMOVE_ADMIN_ROLE } from "./generated/types/REMOVE_ADMIN_ROLE"

const validate = (json) => {
  const res = ajvValidate(json)
  if(!res) { 
    // console.error("JSON Schema validation failed:", ajvValidate)
    throw new Error("Invalid JSON")
  }
  return res
}

export {
  CREATE_CATEGORY,
  CREATE_FORUM,
  CREATE_POST,
  CREATE_THREAD,
  DELETE_CATEGORY,
  DELETE_FORUM,
  DELETE_POST,
  DELETE_THREAD,
  EDIT_CATEGORY,
  EDIT_FORUM,
  EDIT_POST,
  GRANT_ADMIN_ROLE,
  POSTUM_ACTION,
  REMOVE_ADMIN_ROLE
}
export default { 
  schema,
  validate
}
