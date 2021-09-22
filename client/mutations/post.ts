import { ethers } from "ethers"
import { actions } from "@postum/json-schema"
import { post } from "."

export async function createPost(
  signer: ethers.Signer, 
  createPost: actions.CREATE_POST
): Promise<ethers.providers.TransactionResponse> {
  return await post(createPost, signer)
}

export async function editPost(
  signer: ethers.Signer, 
  editPost: actions.EDIT_POST
): Promise<ethers.providers.TransactionResponse> {
  return await post(editPost, signer)
}

export async function deletePost(
  signer: ethers.Signer, 
  deletePost: actions.DELETE_POST
): Promise<ethers.providers.TransactionResponse> {
  return await post(deletePost, signer)
}