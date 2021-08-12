## TODO 
[] tests should check valid and invalid examples of all schema against the validation function
[] upload schema to decentralized storage somewhere? or maybe even onto ethereum somewhere?

## Possible future direction
It's possible this should be wrapped into a client lib that acts like this:
```
import PosterClient from "poster-client"

const pc = new PosterClient(arrayOfJsonSchema)
pc.connect(ethersSigner)

const post = pc.newPost(action, args)
assert(pc.validate(post) == true)

await pc.send(post)
```