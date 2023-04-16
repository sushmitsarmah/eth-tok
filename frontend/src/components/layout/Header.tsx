import React from 'react'
import { Flex, useColorModeValue, Spacer, Heading } from '@chakra-ui/react'
import { SITE_NAME } from 'utils/config'
import { LinkComponent } from './LinkComponent'
import { ThemeSwitcher } from './ThemeSwitcher'
import { ConnectKitButton } from 'connectkit'
import { PassportScore } from './PassportScore'
import Link from 'next/link'

interface Props {
  className?: string
}

export function Header(props: Props) {
  const className = props.className ?? ''

  return (
    <Flex as="header" className={className} bg={useColorModeValue('gray.100', 'gray.900')} px={4} py={2} mb={8} alignItems="center">
      <LinkComponent href="/">
        <Heading as="h1" size="md">
          {SITE_NAME}
        </Heading>
      </LinkComponent>

      <Spacer />

      <Flex alignItems="center" gap={4}>
        <Link className='btn btn-outline' href="/tournaments/create">Create Tournament</Link>
        <Link className='btn btn-outline' href="/tournaments">Tournaments</Link>
        <Link className='btn btn-outline' href="/games">Games</Link>
        <Link className='btn btn-secondary' href="/swaptokens">Swap Tokens OneInch</Link>
        <PassportScore />
        <ConnectKitButton />
        <ThemeSwitcher />
      </Flex>
    </Flex>
  )
}
