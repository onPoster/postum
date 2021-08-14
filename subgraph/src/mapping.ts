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
  if (result.isError) { return }
  let object = result.value.toObject()

  let action = object.get("action")
  let actionString = action.toString()

  let args = object.get("args")
  let argsObj = args.toObject()

  if (actionString == "CREATE_FORUM") {
    createForum(event, argsObj)
    return

  } else if (actionString == "EDIT_FORUM") {
    editForum(event, argsObj)
    return

  } else if (actionString == "DELETE_FORUM") {
    deleteForum(event, argsObj)
    return
    
  } else if (actionString == "CREATE_CATEGORY") {
    createCategory(event, argsObj)
    return
    
  } else if (actionString == "EDIT_CATEGORY") {
    editCategory(event, argsObj)
    return
    
  } else if (actionString == "DELETE_CATEGORY") {
    deleteCategory(event, argsObj)
    return
    
  } else if (actionString == "CREATE_THREAD") {
    createThread(event, argsObj)
    return
    
  } else if (actionString == "DELETE_THREAD") {
    deleteThread(event, argsObj)
    return
    
  } else if (actionString == "CREATE_POST") {
    createPost(event, argsObj)
    return
    
  } else if (actionString == "EDIT_POST") {
    editPost(event, argsObj)
    return
    
  } else if (actionString == "DELETE_POST") {
    deletePost(event, argsObj)
    return
    
  } else if (actionString == "GRANT_ADMIN_ROLE") {
    grantAdminRole(event, argsObj)
    return
    
  } else if (actionString == "REMOVE_ADMIN_ROLE") {
    removeAdminRole(event, argsObj)
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
    "string and bytes-to-string: {} {}",
    [
      str,
      codePoints.toString()
    ]
  )
  return codePoints
}

