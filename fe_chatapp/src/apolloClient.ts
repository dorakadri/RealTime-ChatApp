import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
  Observable,
  ApolloLink,
  split,
} from "@apollo/client";
import {loadErrorMessages,loadDevMessages} from "@apollo/client/dev"
import { getMainDefinition } from "@apollo/client/utilities";
import { useUserStore } from "./stores/userStore";
import { WebSocketLink } from "@apollo/client/link/ws";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { onError } from "@apollo/client/link/error";


loadErrorMessages()
loadDevMessages()
async function refreshToken(client: ApolloClient<NormalizedCacheObject>) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation refreshtoken {
          refreshtoken
        }
      `,
    });
    const newAccessToken = data?.refreshtoken;
    if (!newAccessToken) {
      throw new Error("New access token not received");
    }
    return `Bearer ${newAccessToken}`;
  } catch (error) {
    throw new Error("error getting new access token ");
  }
}

let retryCount = 0;
const maxRetry = 3;

const wsLink = new WebSocketLink({
  uri: `ws://localhost:3000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  },
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions.code === "UNAUTHENTICATED" && retryCount < maxRetry) {
        retryCount++;
        return new Observable((observable) => {
          refreshToken(client)
            .then((token) => {
              operation.setContext((previousContext: any ) => ({
                headers: {
                  ...previousContext.headers,
                  authorization: token,
                },
              }));
              const forward$ = forward(operation);
              forward$.subscribe(observable);
            })
            .catch((err) => observable.error(err));
        });
      }
      if (err.message === "Refresh token not found") {
        useUserStore.setState({
          id: undefined,
          fullname: "",
          email: "",
        });
      }
    }
  }
});

const uploadLink = createUploadLink({
  uri: "http://localhost:3000/graphql",
  credentials: "include",
  headers: { "apollo-require-preflight": "true" },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  ApolloLink.from([errorLink, uploadLink])
);

export const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache({}),
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  link: link,
});
