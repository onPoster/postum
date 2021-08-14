import { ethers } from "ethers"
import PosterJSON from "../artifacts/contracts/Poster.sol/Poster.json"
import { Poster__factory } from "../typechain/factories/Poster__factory"
import { posts } from "./posts"

async function main() {
  const provider = new ethers.providers.JsonRpcProvider()
  const signer = await provider.getSigner(0)

  const poster = Poster__factory.getContract(
    "0x0000000000A84Fe7f5d858c8A22121c975Ff0b42",
    PosterJSON.abi,
    signer
  )

  for(let i = 0; i < posts.length; i++) {
    await poster.post(posts[i])
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })