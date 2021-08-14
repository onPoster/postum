import { ethers } from "ethers"

export const provider = new ethers.providers.JsonRpcProvider()

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}