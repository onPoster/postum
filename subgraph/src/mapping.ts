import { json, Bytes, JSONValue, TypedMap, store, crypto, log } from "@graphprotocol/graph-ts"
import { Poster, NewPost } from "../generated/Poster/Poster"
import { Forum, User, AdminRole } from "../generated/schema"

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

function createForum(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = event.transaction.hash.toHexString()
  let forum = new Forum(id)

  let title = args.get("title")
  let titleString = title.toString()
  forum.title = titleString

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
  let id = args.get("id")
  let idString = id.toString()
  let forum = Forum.load(idString)
  if (forum == null) { return }

  let title = args.get("title")
  let titleString = title.toString()
  forum.title = titleString

  forum.save()
}

function deleteForum(event: NewPost, args: TypedMap<string, JSONValue>): void {
  let id = args.get("id")
  let idString = id.toString()
  let forum = Forum.load(idString)
  if (forum == null) { return }
  store.remove("Forum", idString)
}