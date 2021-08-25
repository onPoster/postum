import { JSONValue, JSONValueKind, TypedMap } from "@graphprotocol/graph-ts"

class JsonArrayResult {
  data: JSONValue[];
  error: string;
}

export function getArrayFromJson(
  object: TypedMap<string, JSONValue>,
  key: string
): JsonArrayResult {
  let result: JsonArrayResult
  result.error = "none"
  let value = object.get(key)
  if (value.kind != JSONValueKind.ARRAY) { 
    result.error = "Missing valid Postum field: " + key
    return result
  }
  result.data = value.toArray()
  return result
}

class JsonStringResult {
  data: string;
  error: string;
}

export function getStringFromJson(
  object: TypedMap<string, JSONValue>,
  key: string
): JsonStringResult {
  let result: JsonStringResult
  result.error = "none"
  let value = object.get(key)
  if (value.kind != JSONValueKind.STRING) { 
    result.error = "Missing valid Postum field: " + key
    return result
  }
  result.data = value.toString()
  return result
}