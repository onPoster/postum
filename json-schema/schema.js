const CREATE_FORUM_schema = {
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "postum/CREATE_FORUM.json",
  "examples": [
      {
          "action": "CREATE_FORUM",
          "args": {
              "title": "Poster",
              "admins": [
                  "0x4171160dB0e7E2C75A4973b7523B437C010Dd9d4",
                  "0x5F8777bbe7977D3ff8A53D00Ba01a34CD8234Aa4"
              ]
          }
      }
  ],
  "required": [
      "action",
      "args"
  ],
  "type": "object",
  "properties": {
      "action": {
          "const": "CREATE_FORUM",
          "type": "string"
      },
      "args": {
          "required": [
              "title",
              "admins"
          ],
          "type": "object",
          "properties": {
              "title": {
                  "type": "string"
              },
              "admins": {
                  "minItems": 1,
                  "type": "array",
                  "items": {
                      "type": "string",
                      "pattern": "^0x[a-fA-F0-9]{40}$"
                  }
              }
          }
      }
  }
}

const EDIT_FORUM_schema = {
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "postum/EDIT_FORUM.json",
  "type": "object",
  "examples": [
      {
          "action": "EDIT_FORUM",
          "args": {
              "id": "12345",
              "title": "Poster"
          }
      }
  ],
  "required": [
      "action",
      "args"
  ],
  "description": "Should be restricted to admins",
  "properties": {
      "action": {
        "const": "EDIT_FORUM",
        "type": "string"
      },
      "args": {
          "required": [
              "id"
          ],
          "type": "object",
          "properties": {
              "id": {
                  "type": "string"
              },
              "title": {
                  "type": "string"
              }
          }
      }
  }
}

const DELETE_FORUM_schema = {
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "postum/DELETE_FORUM.json",
  "required": [
      "action",
      "args"
  ],
  "examples": [
      {
          "action": "DELETE_FORUM",
          "args": {
              "id": "12345"
          }
      }
  ],
  "description": "Should be restricted to admins",
  "type": "object",
  "properties": {
      "action": {
        "const": "DELETE_FORUM",
        "type": "string"
      },
      "args": {
          "type": "object",
          "required": [
              "id"
          ],
          "properties": {
              "id": {
                  "type": "string"
              }
          }
      }
  }
}

const POSTUM_ACTION_schema = {
  "oneOf": [
    CREATE_FORUM_schema,
    EDIT_FORUM_schema,
    DELETE_FORUM_schema
  ]
}

module.exports = {
  CREATE_FORUM_schema,
  EDIT_FORUM_schema,
  DELETE_FORUM_schema,
  POSTUM_ACTION_schema
}