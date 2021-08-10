const { POSTUM_ACTION_schema } = require("../schema.js")
const { compile } = require('json-schema-to-typescript')
const fs = require("fs")
const path = require("path")

async function main(jsonSchema, name) {
  const ts = await compile(jsonSchema, name)
  console.log(ts)
  fs.writeFileSync(path.join(__dirname, "../generated/Schema.d.ts"), ts)
}

main(POSTUM_ACTION_schema, "PostumAction")