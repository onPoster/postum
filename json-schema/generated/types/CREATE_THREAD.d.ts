/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Also creates the thread's first post
 */
export interface CREATE_THREAD {
  action: "CREATE_THREAD";
  args: {
    forum: string;
    category?: string;
    title: string;
    /**
     * Should be stringified markdown or similar
     */
    content: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}