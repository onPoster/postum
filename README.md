# POSTUM
### *Decentralized protocol for forums implemented on the Poster contract*

Postum is a working title for a decentralized forum product built on the [Poster smart contract](https://github.com/ETHPoster). The goal is to create a product that:
- Lets anyone create/edit/delete forums with admins, categories, threads, and posts
- Uses Ethereum addresses as accounts, so a DAO or other group can make posts, administer a forum, etc.
- Is not dependent on a centralized service for any major component, including UI
- Is cheap, fast, and easy enough to compete with Discourse, the current, centralized choice for most crypto communities

# Packages
## json-schema
Defines the actions users can take to affect the state of the Postum app--e.g. CREATE_POST, EDIT_CATEGORY, etc.--using the JSON schema standard. Also implements:
- an exported validation function to check for valid Postum actions
- basic typescript interface approximations of the JSON schema

## poster
An extremely simple smart contract that emits an event containing a string and nothing else, reducing gas costs nearly to the base cost of a transaction (21000 gas, iirc).

Users will take actions in the Postum app by submitting stringified valid Postum action JSON objects to this contract.

This is a minimal fork of the main poster contract repo to facilitate local development.

## subgraph
This is the core of Postum -- a subgraph for The Graph that watches the Poster contract for valid Postum actions. When valid actions come in, the subgraph parses and processes them to change the state of the app, which can then be queried via http/wss.

## client
A typescript client intended to be imported by and to enable Postum frontends. The client integrates the other packages and provides to sets of methods:
- mutations, which help frontends construct and submit Postum actions on behalf of users 
- queries, which request state information from the subgraph

# Local Development
To standup a local environment and run tests:

Have docker installed and working!

`yarn` -- installs dependencies

`yarn up` -- spins up docker services for the packages: ganache for Ethereum; graph-node, IPFS, and postgres for the subgraph

`yarn deploy-local` -- deploys local services: Ethereum smart contract & subgraph

`yarn test` -- runs tests (currently only integration testing in the `client` package)

`docker logs postum_graph-node_1` (checking the docker logs for the graph-node service) is particularly helpful for debugging the subgraph.

Note:
- npm should also work, but I have not tested it
- I have only implemented integration tests (the client tests), since 1) the poster contract should be tested in its main repo, 2) there is no good subgraph unit testing framework (yet), 3) haven't gotten to it

### Ganache accounts for local development
```
(0) 0xb2c488b68a775c823263a436bbb8876c4ba64c4b21a0713c5fede5ad369ef89b
(1) 0x5202280f7887b8962a7351b037eb76392fd6dec3d979a6312933a160271fb266
(2) 0xfc69e6be7682c78b985bddc4d35c149313c03f122529e76d1666397533f1a480
(3) 0xb9010af24dc60e6566cf34beda73be9e706d49e18e13916fb6d475cea432118b
(4) 0xb04ebd6ac8c8fd8331d818128f9506816db26f80bf0dc992a8db987fb25fef8c
(5) 0x0a7f2d5ab35209dd138933297a411a93226284980fa541d36376eff313b4c428
(6) 0xbf177ef6f776c127fd172f236e82fcc5911ef055f551c5f6ac3b0c33a100c509
(7) 0x0591fa96aefe23911faba79f3cc699c9d104dfa49097b81ef2560cccc7775fb3
(8) 0xa72626308bbe1c4ea491b1f4a861636b008b25d743deb912f70b2ff9678cf97e
(9) 0x357304b1e6db5691b6102341f28c676905535d1c17cc64ef4d591c009776d742
```

# Contributing
Please read [this](https://ethereum-magicians.org/t/eip-eip-3722-poster-a-ridiculously-simple-general-purpose-social-media-smart-contract/6751/58) Ethereum Magicians thead for context.

Other than that, contributions welcome! Please be clear and respectful. You can contact Ezra via the thread linked above or on twitter @m0zrat.

### TODOs
**Must have:**
- Unit testing
- Frontend
- Production deployment on a cheap Ethereum layer 2

**Should have:**
- Linting
- Test coverage analysis
- Something to manage versioning and deploying new versions
- The Poster contract should possibly take and emit Bytes instead of a string for greater efficiency (may not matter since it looks like the large majority of the costs will come from the base Ethereum transaction fee, which won't change, and The Graph fees, which are based on queries, I think).

### Questions
- Because decentralization is an important feature of this project, Postum (and all Poster apps) should use The Graph's network service, which charges fees. Will the combination of Ethereum layer 2s and The Graph fees be cheap enough for social media applications to succeed? Based on the way the graph network [calculates fees](https://thegraph.com/blog/the-graph-grt-token-economics), this seems hard to estimate accurately before trying it.

- If this is a successful framework, can we create a Poster app template that lets users define JSON schema actions and graphql database entities, then generates much of the needed boilerplate code for you?