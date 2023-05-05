
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_THEGRAPH_BASE_URL || 'https://api.thegraph.com/subgraphs/name/smart-holder/smart-dao',
    cache: new InMemoryCache(),
});

const ApolloClientApp = (props:any) => {
    return (
        <ApolloProvider client={client}>
            {props.children}
        </ApolloProvider>
    )
}
export default ApolloClientApp;