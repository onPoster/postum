import { json, Bytes, log, ByteArray, JSONValue, TypedMap, JSONValueKind } from "@graphprotocol/graph-ts"
import { NewPost } from "../generated/Poster/Poster"
import { getStringFromJson } from "./utils"
import {
  createForum,
  editForum,
  deleteForum
} from "./actions/forum"
import {
  createCategory,
  editCategory,
  deleteCategory
} from "./actions/category"
import {
  createThread,
  deleteThread
} from "./actions/thread"
import {
  createPost,
  editPost,
  deletePost
} from "./actions/post"
import {
  grantAdminRole,
  removeAdminRole
} from "./actions/adminRole"

export function handleNewPost(event: NewPost): void {
  let objRes = getResultFromJson(event.params.content)
  if (objRes.error != "none") { log.warning(objRes.error, []); return }
  let object = objRes.object 

  let actRes = getStringFromJson(object, "action")
  if (actRes.error != "none") { log.warning(actRes.error, []); return }
  let action = actRes.data

  let argsRes = getObjFromJson(object, "args")
  if (argsRes.error != "none") { log.warning(argsRes.error, []); return }
  let args = argsRes.data

  log.info(
    "processing action: {}",
    [action]
  )

  if (action == "CREATE_FORUM") {
    createForum(event, args)
    return

  } else if (action == "EDIT_FORUM") {
    editForum(event, args)
    return

  } else if (action == "DELETE_FORUM") {
    deleteForum(event, args)
    return
    
  } else if (action == "CREATE_CATEGORY") {
    createCategory(event, args)
    return
    
  } else if (action == "EDIT_CATEGORY") {
    editCategory(event, args)
    return
    
  } else if (action == "DELETE_CATEGORY") {
    deleteCategory(event, args)
    return
    
  } else if (action == "CREATE_THREAD") {
    createThread(event, args)
    return
    
  } else if (action == "DELETE_THREAD") {
    deleteThread(event, args)
    return
    
  } else if (action == "CREATE_POST") {
    createPost(event, args)
    return
    
  } else if (action == "EDIT_POST") {
    editPost(event, args)
    return
    
  } else if (action == "DELETE_POST") {
    deletePost(event, args)
    return
    
  } else if (action == "GRANT_ADMIN_ROLE") {
    grantAdminRole(event, args)
    return
    
  } else if (action == "REMOVE_ADMIN_ROLE") {
    removeAdminRole(event, args)
    return
    
  }
}

class JsonResult {
  object: TypedMap<string, JSONValue>;
  error: string;
}

function getResultFromJson(content: string): JsonResult {
  let result: JsonResult
  result.error = "none"
  let jsonResult = json.try_fromBytes(
    ByteArray.fromUTF8(content) as Bytes
  )
  if (jsonResult.isError) { 
    result.error = "Failed to parse JSON"
    return result
  }
  result.object = jsonResult.value.toObject()
  return result
}

class JsonObjResult {
  data: TypedMap<string, JSONValue>;
  error: string;
}

function getObjFromJson(
  object: TypedMap<string, JSONValue>,
  key: string
): JsonObjResult {
  let result: JsonObjResult
  result.error = "none"
  let value = object.get(key)
  if (value.kind != JSONValueKind.OBJECT) { 
    result.error = "Missing valid Postum field: " + key
    return result
  }
  result.data = value.toObject()
  return result
}