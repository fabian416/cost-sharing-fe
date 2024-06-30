// src/apolloClient.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/your-username/balances-subgraph',
  cache: new InMemoryCache(),
});

export default client;
