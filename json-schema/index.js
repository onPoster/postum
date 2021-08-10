const ajvValidate = require("./generated/validate.js")

const validate = (json) => {
  const res = ajvValidate(json)
  if(!res) { 
    console.error("JSON Schema validation failed:", ajvValidate.errors) 
  }
  return res
}

module.exports = { validate }
