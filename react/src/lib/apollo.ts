import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: "http://localhost:8000/subgraphs/name/EzraWeller/postum",
  cache: new InMemoryCache()
})

