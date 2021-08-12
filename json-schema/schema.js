const CREATE_FORUM_schema = {
  "$id": "postum/CREATE_FORUM.json",
  "$schema": "http://json-schema.org/draft-07/schema",
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
  "$id": "postum/EDIT_FORUM.json",   
  "$schema": "http://json-schema.org/draft-07/schema",
  "type": "object",
  "examples": [
      {
          "action": "EDIT_FORUM",
          "args": {
              "id": "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
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
                  "pattern": "^0x[A-Fa-f0-9]{64}$",
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
  "$id": "postum/DELETE_FORUM.json",
  "$schema": "http://json-schema.org/draft-07/schema",
  "required": [
      "action",
      "args"
  ],
  "examples": [
      {
          "action": "DELETE_FORUM",
          "args": {
              "id": "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
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
                  "pattern": "^0x[A-Fa-f0-9]{64}$",
                  "type": "string"
              }
          }
      }
  }
}

const CREATE_CATEGORY_schema = {
    "$id": "postum/CREATE_CATEGORY.json",
    "$schema": "http://json-schema.org/draft-07/schema",
    "examples": [
        {
            "action": "CREATE_CATEGORY",
            "args": {
                "forum": "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                "name": "New Category",
                "description": "discuss the new category"
            }
        }
    ],
    "required": [
        "action",
        "args"
    ],
    "description": "Should be restricted to admins",
    "type": "object",
    "properties": {
        "action": {
            "const": "CREATE_CATEGORY",
            "type": "string"
        },
        "args": {
            "required": [
                "forum",
                "name",
                "description"
            ],
            "type": "object",
            "properties": {
                "forum": {
                    "pattern": "^0x[A-Fa-f0-9]{64}$",
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                }
            }
        }
    }
}

const EDIT_CATEGORY_schema = {
    "$id": "postum/EDIT_CATEGORY.json",
    "$schema": "http://json-schema.org/draft-07/schema",
    "examples": [
        {
            "action": "EDIT_CATEGORY",
            "args": {
                "id": "0x5F8777bbe7977D3ff8A53D00Ba01a34CD8234Aa4",
                "name": "Edited Category",
                "description": "discuss the edited category"
            }
        }
    ],
    "required": [
        "action",
        "args"
    ],
    "description": "Should be restricted to admins",
    "type": "object",
    "properties": {
        "action": {
            "const": "EDIT_CATEGORY",
            "type": "string"
        },
        "args": {
            "required": [
                "id"
            ],
            "type": "object",
            "properties": {
                "id": {
                    "pattern": "^0x[A-Fa-f0-9]{40}$",
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                }
            }
        }
    }
}

const DELETE_CATEGORY_schema = {
    "$id": "postum/DELETE_CATEGORY.json",
    "$schema": "http://json-schema.org/draft-07/schema",
    "examples": [
        {
            "action": "DELETE_CATEGORY",
            "args": {
                "id": "0x5F8777bbe7977D3ff8A53D00Ba01a34CD8234Aa4"
            }
        }
    ],
    "required": [
        "action",
        "args"
    ],
    "description": "Should be restricted to admins",
    "type": "object",
    "properties": {
        "action": {
            "const": "DELETE_CATEGORY",
            "type": "string"
        },
        "args": {
            "required": [
                "id"
            ],
            "type": "object",
            "properties": {
                "id": {
                    "pattern": "^0x[A-Fa-f0-9]{40}$",
                    "type": "string"
                }
            }
        }
    }
}

const CREATE_THREAD_schema = {
    "$id": "postum/CREATE_THREAD.json",
    "$schema": "http://json-schema.org/draft-07/schema",
    "examples": [
        {
            "action": "CREATE_THREAD",
            "args": {
                "forum": "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                "category": "0x5F8777bbe7977D3ff8A53D00Ba01a34CD8234Aa4",
                "title": "New Thread",
                "content": "Example post content"
            }
        }
    ],
    "required": [
        "action",
        "args"
    ],
    "description": "Also creates the thread's first post",
    "type": "object",
    "properties": {
        "action": {
            "const": "CREATE_THREAD",
            "type": "string"
        },
        "args": {
            "required": [
                "forum",
                "title",
                "content"
            ],
            "type": "object",
            "properties": {
                "forum": {
                    "pattern": "^0x[A-Fa-f0-9]{64}$",
                    "type": "string"
                },
                "category": {
                    "pattern": "^0x[A-Fa-f0-9]{40}$",
                    "type": "string"
                },
                "title": {
                    "type": "string"
                },
                "content": {
                    "type": "string",
                    "description": "Should be stringified markdown or similar"
                }
            }
        }
    }
}

const DELETE_THREAD_schema = {
    "$id": "postum/DELETE_THREAD.json",
    "$schema": "http://json-schema.org/draft-07/schema",
    "examples": [
        {
            "action": "DELETE_THREAD",
            "args": {
                "id": "0x5F8777bbe7977D3ff8A53D00Ba01a34CD8234Aa4"
            }
        }
    ],
    "required": [
        "action",
        "args"
    ],
    "description": "Should be admin only",
    "type": "object",
    "properties": {
        "action": {
            "const": "DELETE_THREAD",
            "type": "string"
        },
        "args": {
            "required": [
                "id"
            ],
            "type": "object",
            "properties": {
                "id": {
                    "pattern": "^0x[A-Fa-f0-9]{40}$",
                    "type": "string"
                }
            }
        }
    }
}

const CREATE_POST_schema = {}

const EDIT_POST_schema = {}

const DELETE_POST_schema = {}

const GRANT_ADMIN_ROLE_schema = {}

const REMOVE_ADMIN_ROLE_schema = {}

/**
 * Delete Category
Params
    ID
Handler logic notes
    Admin only
    Deletes category, but not any posts

Create Thread
Params
    Title
    forum
    Category
    Content
Handler logic notes
    creates the thread's first post

Delete Thread
Params
    ID
Handler logic notes
    Admin only

Create Post
Params
    Content
    reply_to_post
Thread ID
    Handler logic notes

Edit Post
Params
    ID
    Content
Handler logic notes
    Post author only

Delete Post
Params
    ID
Handler logic notes
    Post author or admin only

Grant Admin Role
Params
    User ID
    forum ID
Handler logic notes
    forum admins only

Remove Admin Role
Params
    ID
Handler logic notes
    forum admins only
    Cannot reduce a forum below 1 admin roles
 */

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