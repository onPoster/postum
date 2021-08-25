const Ajv = require("ajv")
const ajv = new Ajv({code: {source: true}})
const standaloneCode = require("ajv/dist/standalone").default
const { POSTUM_ACTION_schema } = require("../schema.js")

// generate module with a single default export (CommonJS and ESM compatible):
const validate = ajv.compile(POSTUM_ACTION_schema)
const moduleCode = standaloneCode(ajv, validate)

// write module code to file
const fs = require("fs")
const path = require("path")
fs.writeFileSync(path.join(__dirname, "../generated/validate.js"), moduleCode)