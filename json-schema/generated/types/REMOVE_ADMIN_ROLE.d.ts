/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Should be admin only and not allow reducing total admins for a forum below 1
 */
export interface REMOVE_ADMIN_ROLE {
  action: "REMOVE_ADMIN_ROLE";
  args: {
    forum: string;
    user: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
