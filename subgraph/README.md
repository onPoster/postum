### Note on Graph Entities with Derived Array Fields
As written in The Graph discord:
> Derived fields are built at query time.
> In other words "posts" does not exist when the mapping code is run

This means if you have a "to-many" relationship in your subgraph, you will *not*
be able to iterate over it in mappings.
I'm currently getting around this in a few ways, including using entity IDs that are derived from the other side of the entity (e.g. find if a user is an admin because we know the ID that admin role would have without iterating). This problem apparently does not persist to non-derived relationships, so another option could be to manually initiate both ends of the relationship.
