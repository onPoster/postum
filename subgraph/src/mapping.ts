import { json, Bytes, log, ByteArray, JSONValueKind } from "@graphprotocol/graph-ts"
import { NewPost } from "../generated/Poster/Poster"
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
  let result = json.try_fromBytes(
    ByteArray.fromUTF8(event.params.content) as Bytes
  )
  if (result.isError) { 
    log.warning("Failed to parse JSON", [])
    return 
  }

  let object = result.value.toObject()
  let actionValue = object.get("action")
  if (actionValue.kind != JSONValueKind.STRING) { 
    log.warning("Skipping post: missing valid Postum 'action' field", [])
    return 
  }
  let action = actionValue.toString()
  
  let argsValue = object.get("args")
  if (argsValue.kind != JSONValueKind.OBJECT) { 
    log.warning("Skipping post: missing valid Postum 'args' field", [])
    return 
  }
  let args = argsValue.toObject()

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