import type { AppProps } from 'next/app'
import { Layout } from 'components/layout'
import { Web3Provider } from 'providers/Web3'
import { ChakraProvider } from 'providers/Chakra'
import { useIsMounted } from 'hooks/useIsMounted'
import { Seo } from 'components/layout/Seo'

import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';

import '../styles/globals.css'

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: "9fa657e8-fe18-4b6e-94b9-106353efffac",
  }),
});

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted()

  return (
    <LivepeerConfig client={livepeerClient}>
      <ChakraProvider>
        <Seo />
        <Web3Provider>
          {isMounted && (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </Web3Provider>
      </ChakraProvider>
    </LivepeerConfig>
  )
}
