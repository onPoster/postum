import { json, Bytes, log } from "@graphprotocol/graph-ts"
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
  let bytes = stringToBytes(event.params.content)
  let result = json.try_fromBytes(bytes)
  if (result.isError) { 
    log.warning("Failed to parse JSON", [])
    return 
  }
  let object = result.value.toObject()
  let action = object.get("action").toString()
  let args = object.get("args").toObject()

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

// If Poster content was Bytes, we wouldn't have to do this
function stringToBytes(str: string): Bytes {
  let codePoints = new Bytes(str.length)
  for(let i = 0; i < str.length; i++) {
    codePoints[i] = str.codePointAt(i)
  }
  log.info(
    "String and bytes-to-string: {} {}",
    [
      str,
      codePoints.toString()
    ]
  )
  return codePoints
}