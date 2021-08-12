# POSTUM
*Decentralized protocol for forums implemented on the Poster contract*

--very WIP!!--

Current Packages:
- poster: a minimal fork of the Poster contract repo for use in testing the other packages
- json-schema: defines user actions for Postum and generates a js library for validating (anticipate this being useful for a frontend)
- subgraph: listens for Poster events that implement the json-schema and constructs state for a front-end to read from

Future Packages:
- client: uses the json schema to facilitate send valid Postum tx to the Poster contract
- frontend: helps users use the client to send tx and reads the subgraph to display state

## TODO
- [ ] assign ens names to forums (each ens can only be attached to one forum at a time, and can only be assigned by the current owner of the ens name)
- [ ] support emojies

## Speculation
Perhaps eventually this becomes a dev kit for developing Poster app backends: 
- create your JSON schema
- auto-generate client code for sending those schema to the Poster contract
- standard graph AS that categorizes incoming events by your JSON schema and blank functions for each schema
