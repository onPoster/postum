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

const CREATE_POST_schema = {
    "$id": "postum/CREATE_POST.json",
    "$schema": "http://json-schema.org/draft-07/schema",
    "examples": [
        {
            "action": "CREATE_POST",
            "args": {
                "reply_to_post": "0x5F8777bbe7977D3ff8A53D00Ba01a34CD8234Aa4",
                "content": "Post content"
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
            "const": "CREATE_POST",
            "type": "string"
        },
        "args": {
            "required": [
                "content"
            ],
            "type": "object",
            "properties": {
                "reply_to_post": {
                    "pattern": "^0x[A-Fa-f0-9]{40}$",
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

const EDIT_POST_schema = {
    "$id": "postum/EDIT_POST.json",
    "$schema": "http://json-schema.org/draft-07/schema",
    "examples": [
        {
            "action": "EDIT_POST",
            "args": {
                "id": "0x5F8777bbe7977D3ff8A53D00Ba01a34CD8234Aa4",
                "content": "Edited post content"
            }
        }
    ],
    "required": [
        "action",
        "args"
    ],
    "description": "Should be post author only",
    "type": "object",
    "properties": {
        "action": {
            "const": "EDIT_POST",
            "type": "string"
        },
        "args": {
            "required": [
                "id",
                "content"
            ],
            "type": "object",
            "properties": {
                "id": {
                    "pattern": "^0x[A-Fa-f0-9]{40}$",
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

const DELETE_POST_schema = {
    "$id": "postum/DELETE_POST.json",
    "$schema": "http://json-schema.org/draft-07/schema",
    "examples": [
        {
            "action": "DELETE_POST",
            "args": {
                "id": "0x5F8777bbe7977D3ff8A53D00Ba01a34CD8234Aa4",
            }
        }
    ],
    "required": [
        "action",
        "args"
    ],
    "description": "Should be admin or post author only",
    "type": "object",
    "properties": {
        "action": {
            "const": "DELETE_POST",
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

const GRANT_ADMIN_ROLE_schema = {
    "$id": "postum/GRANT_ADMIN_ROLE.json",
    "$schema": "http://json-schema.org/draft-07/schema",
    "examples": [
        {
            "action": "GRANT_ADMIN_ROLE",
            "args": {
                "forum": "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                "user": "0x5F8777bbe7977D3ff8A53D00Ba01a34CD8234Aa4"
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
            "const": "GRANT_ADMIN_ROLE",
            "type": "string"
        },
        "args": {
            "required": [
                "forum",
                "user"
            ],
            "type": "object",
            "properties": {
                "forum": {
                    "pattern": "^0x[A-Fa-f0-9]{64}$",
                    "type": "string"
                },
                "user": {
                    "pattern": "^0x[A-Fa-f0-9]{40}$",
                    "type": "string"
                }
            }
        }
    }
}

const REMOVE_ADMIN_ROLE_schema = {
    "$id": "postum/REMOVE_ADMIN_ROLE.json",
    "$schema": "http://json-schema.org/draft-07/schema",
    "examples": [
        {
            "action": "REMOVE_ADMIN_ROLE",
            "args": {
                "forum": "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                "user": "0x5F8777bbe7977D3ff8A53D00Ba01a34CD8234Aa4"
            }
        }
    ],
    "required": [
        "action",
        "args"
    ],
    "description": "Should be admin only and not allow reducing total admins for a forum below 1",
    "type": "object",
    "properties": {
        "action": {
            "const": "REMOVE_ADMIN_ROLE",
            "type": "string"
        },
        "args": {
            "required": [
                "id"
            ],
            "type": "object",
            "properties": {
                "forum": {
                    "pattern": "^0x[A-Fa-f0-9]{64}$",
                    "type": "string"
                },
                "user": {
                    "pattern": "^0x[A-Fa-f0-9]{40}$",
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
    DELETE_FORUM_schema,
    CREATE_CATEGORY_schema,
    EDIT_CATEGORY_schema,
    DELETE_CATEGORY_schema,
    CREATE_THREAD_schema,
    DELETE_THREAD_schema,
    CREATE_POST_schema,
    EDIT_POST_schema,
    DELETE_POST_schema,
    GRANT_ADMIN_ROLE_schema,
    REMOVE_ADMIN_ROLE_schema
  ]
}

module.exports = {
  CREATE_FORUM_schema,
  EDIT_FORUM_schema,
  DELETE_FORUM_schema,
  CREATE_CATEGORY_schema,
  EDIT_CATEGORY_schema,
  DELETE_CATEGORY_schema,
  CREATE_THREAD_schema,
  DELETE_THREAD_schema,
  CREATE_POST_schema,
  EDIT_POST_schema,
  DELETE_POST_schema,
  GRANT_ADMIN_ROLE_schema,
  REMOVE_ADMIN_ROLE_schema,
  POSTUM_ACTION_schema
}