import { ethers } from "ethers"
import {
  CREATE_POST,
  DELETE_POST,
  EDIT_POST
} from "@postum/json-schema"
import { post } from "."

export async function createPost(
  signer: ethers.Signer, 
  createPost: CREATE_POST
) {
  await post(createPost, signer)
}

export async function editPost(
  signer: ethers.Signer, 
  editPost: EDIT_POST
) {
  await post(editPost, signer)
}

export async function deletePost(
  signer: ethers.Signer, 
  deletePost: DELETE_POST
) {
  await post(deletePost, signer)
}