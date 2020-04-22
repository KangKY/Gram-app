// const apolloClientOptions = {
//   //uri: "https://secondfamily.herokuapp.com/"
//   uri:"http://192.168.0.143:4000/"
// };


import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, Observable, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { AsyncStorage } from "react-native";
import { persistCache } from "apollo-cache-persist";
const httpLink = new HttpLink({
  uri: "http://192.168.0.143:4000/"
});

const wsLink = new WebSocketLink({
  uri: `ws://192.168.0.143:4000/`,
  options: {
    reconnect: true
  }
});

const request = async operation => {
  //console.log(token);
  const token = await AsyncStorage.getItem("jwt");
  //console.log(`Token:`,token);
  operation.setContext({
    headers: { Authorization: `Bearer ${token}` }
  });

};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle;
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: AsyncStorage
});

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError)  {
        console.log(networkError);
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    requestLink,
    split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    )
  ]),
  cache
});

export default client;
