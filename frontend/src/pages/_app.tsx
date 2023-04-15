import type { AppProps } from 'next/app'
import { Layout } from 'components/layout'
import { Web3Provider } from 'providers/Web3'
import { ChakraProvider } from 'providers/Chakra'
import { useIsMounted } from 'hooks/useIsMounted'
import { Seo } from 'components/layout/Seo'

import { useHuddle01 } from '@huddle01/react';

const HUDDLE_PROJ_ID = "KL1r3E1yHfcrRbXsT4mcE-3mK60Yc3YR";

import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';

import '../styles/globals.css'
import { useEffect } from 'react'

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: "9fa657e8-fe18-4b6e-94b9-106353efffac",
  }),
});

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted()
  const { initialize, isInitialized } = useHuddle01();

  useEffect(() => {
    // its preferable to use env vars to store projectId
    initialize(HUDDLE_PROJ_ID);
  }, []);

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
