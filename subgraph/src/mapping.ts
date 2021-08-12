import { json, Bytes, JSONValue, TypedMap, store, crypto, log, ByteArray } from "@graphprotocol/graph-ts"
import { Poster, NewPost } from "../generated/Poster/Poster"
import { Forum, Category, User, AdminRole } from "../generated/schema"

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

// ==== Action Functions ====

function createForum(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = event.transaction.hash.toHexString()
  let forum = new Forum(id)
  forum.title = args.get("title").toString()

  let admins = args.get("admins")
  let adminArray = admins.toArray()
  for(let i = 0; i < adminArray.length; i++) {
    let userId = adminArray[i].toString()
    let user = User.load(userId)
    if (user == null) { user = new User(userId) }
    let adminRole = new AdminRole(forum.id + '-' + user.id)
    adminRole.forum = forum.id
    adminRole.user = user.id
    adminRole.save()
    user.save()
  }

  forum.save()
}

function editForum(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = args.get("id").toString()
  let forum = Forum.load(id)
  if (forum == null) { return } 
  forum.title = args.get("title").toString()
  forum.save()
}

function deleteForum(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = args.get("id").toString()
  let forum = Forum.load(id)
  if (forum == null) { return }
  store.remove("Forum", id)
}

function createCategory(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let forumId = args.get("forum").toString()
  let forum = Forum.load(forumId)
  if (forum == null) { return }

  let eventHash = event.transaction.hash.toHexString()
  let idBytes = ByteArray.fromHexString(forumId + eventHash)
  let id = crypto.keccak256(idBytes).toHexString()
  let category = new Category(id)
  category.forum = forumId
  category.name = args.get("name").toString()
  category.description = args.get("description").toString()
  category.save()
}

function editCategory(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = args.get("id").toString()
  let category = Category.load(id)
  if (category == null) { return }
  category.name = args.get("name").toString()
  category.description = args.get("description").toString()
}

function deleteCategory(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = args.get("id").toString()
  let category = Category.load(id)
  if (category == null) { return }
  store.remove("Category", id)
}

function createThread(event: NewPost, args: TypedMap<string, JSONValue>): void {
}

function deleteThread(event: NewPost, args: TypedMap<string, JSONValue>): void {
}

function createPost(event: NewPost, args: TypedMap<string, JSONValue>): void {
}

function editPost(event: NewPost, args: TypedMap<string, JSONValue>): void {
}

function deletePost(event: NewPost, args: TypedMap<string, JSONValue>): void {
}

function grantAdminRole(event: NewPost, args: TypedMap<string, JSONValue>): void {
}

function removeAdminRole(event: NewPost, args: TypedMap<string, JSONValue>): void {
}

