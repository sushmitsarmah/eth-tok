import { ThemingProps } from '@chakra-ui/react'
import { mainnet, sepolia, polygon, optimism, arbitrum } from '@wagmi/chains'

export const SITE_NAME = 'BlitzSquad'
export const SITE_DESCRIPTION = 'Unleash the Blitz: Play, Stream, Bet - All Sports, One Arena!'
export const SITE_URL = 'https://nexth.vercel.app'

export const THEME_INITIAL_COLOR = 'dark'
export const THEME_COLOR_SCHEME: ThemingProps['colorScheme'] = 'blackAlpha'
export const THEME_CONFIG = {
  initialColorMode: THEME_INITIAL_COLOR,
}

export const SOCIAL_TWITTER = 'wslyvh'
export const SOCIAL_GITHUB = 'wslyvh/nexth'

export const ETH_CHAINS = [mainnet, sepolia, polygon, optimism, arbitrum]

export const SERVER_SESSION_SETTINGS = {
  cookieName: SITE_NAME,
  password: process.env.SESSION_PASSWORD ?? 'UPDATE_TO_complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
