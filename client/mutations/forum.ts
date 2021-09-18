import { ethers } from "ethers"
import { actions } from "@postum/json-schema"
import { post } from "."

export async function createForum(
  signer: ethers.Signer, 
  createForum: actions.CREATE_FORUM
): Promise<ethers.providers.TransactionResponse> {
  return await post(createForum, signer)
}

export async function editForum(
  signer: ethers.Signer,
  editForum: actions.EDIT_FORUM
): Promise<ethers.providers.TransactionResponse> {
  return await post(editForum, signer)
}

export async function deleteForum(
  signer: ethers.Signer,
  deleteForum: actions.DELETE_FORUM
): Promise<ethers.providers.TransactionResponse> {
  return await post(deleteForum, signer)
}