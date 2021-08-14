import { ethers } from "ethers"
import { 
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  EDIT_CATEGORY
} from "@postum/json-schema"
import { post } from "."

export async function createCategory(
  signer: ethers.Signer, 
  createCategory: CREATE_CATEGORY
) {
  await post(createCategory, signer)
}

export async function editCategory(
  signer: ethers.Signer, 
  editCategory: EDIT_CATEGORY
) {
  await post(editCategory, signer)
}

export async function deleteCategory(
  signer: ethers.Signer, 
  deleteCategory: DELETE_CATEGORY
) {
  await post(deleteCategory, signer)
}