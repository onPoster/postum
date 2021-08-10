# POSTUM
*A forum implemented using the Poster contract*

--very WIP!!--

Current Packages:
- poster: a minimal fork of the Poster contract repo for use in testing the other packages
- json-schema: defines user actions for Postum and generates a js library for validating (anticipate this being useful for a frontend)
- subgraph: listens for Poster events that implement the json-schema and constructs state for a front-end to read from

Future Packages:
- client: uses the json schema to facilitate send valid Postum tx to the Poster contract
- frontend: helps users use the client to send tx and reads the subgraph to display state