import { ethers } from "ethers"
import { actions } from "@postum/json-schema"
import { post } from "."

export async function createCategory(
  signer: ethers.Signer, 
  createCategory: actions.CREATE_CATEGORY
) {
  await post(createCategory, signer)
}

export async function editCategory(
  signer: ethers.Signer, 
  editCategory: actions.EDIT_CATEGORY
) {
  await post(editCategory, signer)
}

export async function deleteCategory(
  signer: ethers.Signer, 
  deleteCategory: actions.DELETE_CATEGORY
) {
  await post(deleteCategory, signer)
}