/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Should be restricted to admins
 */
export interface EDIT_CATEGORY {
  action: "EDIT_CATEGORY";
  args: {
    id: string;
    title?: string;
    description?: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
