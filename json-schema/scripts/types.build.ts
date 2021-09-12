const schema = require("../schema.ts")
const { compile } = require('json-schema-to-typescript')
const fs = require("fs")
const path = require("path")

async function main() {
  for(let i = 0; i < Object.keys(schema).length; i++) {
    let name = Object.keys(schema)[i]
    const json = schema[name]
    const nameSplit = name.split("_")
    nameSplit.splice(-1, 1)
    name = nameSplit.join("_")
    const ts = await compile(json, name)
    fs.writeFileSync(path.join(__dirname, `../generated/${name}.ts`), ts)
  }
}

main()