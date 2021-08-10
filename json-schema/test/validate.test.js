const { validate } = require("../index.js")

const badData = {
  foo: 1,
  bar: "abc"
}

const goodData = {
  action: "CREATE_FORUM",
  args: {
      title: "Poster",
      admins: [
          "0x4171160dB0e7E2C75A4973b7523B437C010Dd9d4",
          "0x5F8777bbe7977D3ff8A53D00Ba01a34CD8234Aa4"
      ]
  }
}

console.log(validate(badData))
console.log(validate(goodData))