import Ajv from 'ajv'

import * as schema from "./schema"
import * as actions from "./actions"

const ajv = new Ajv()
const ajvValidate = ajv.compile(schema.POSTUM_ACTION_schema)
const validate = (json: actions.POSTUM_ACTION) => {
  const res = ajvValidate(json)
  if(!res) {
    throw new Error("Invalid JSON")
  }
  return res
}

export { 
  schema,
  actions,
  validate
}
