import { Text } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import { LinkComponent } from 'components/layout/LinkComponent'

import Link from 'next/link';

import img from '../assets/images/landing_bet.png';
import game1 from '../assets/images/cs.png';
import game2 from '../assets/images/asphalt.png';
import game3 from '../assets/images/pubg.png';
import game4 from '../assets/images/fortnite.png';
import stream from '../assets/images/stream_landing.png';

export default function Home() {
  return (
    <>
      <Head />

      <main className='flex flex-col gap-4'>

        <div className='flex flex-row gap-4 justify-between'>
          <div className='w-3/4 flex flex-col gap-10 justify-center'>
            <h1 className='text-5xl font-bold'>Play, Stream, Bet All Sports, One Arena!</h1>
            <p className='text-2xl text-white'>Ignite Your Passion in Our All-in-One Web3 Playground - From eSports Tournaments to Global Events, Unleash Your Talent and Experience the Ultimate Fusion of Gaming and Sports</p>
            <div className='flex flex-row gap-4'>
              <Link href="/tournaments" className='btn bg-[#FF992D] text-white'>Play Now</Link>
              <button className='btn btn-ghost'>Learn More</button>
            </div>
          </div>
          <div className='w-1/4'>
            <img src={img.src} />
          </div>
        </div>

        <div className='flex flex-col gap-10 justify-between'>
          <h1 className='text-5xl font-bold'>Play Games, You Love</h1>
          <ul className='flex flex-row gap-4 justify-between list-none'>
            <li><img src={game1.src} /></li>
            <li><img src={game2.src} /></li>
            <li><img src={game3.src} /></li>
            <li><img src={game4.src} /></li>
          </ul>
        </div>

        <div className='flex flex-col gap-10 justify-between'>
          <h1 className='text-5xl font-bold'>Stream</h1>
          <div className='flex flex-row gap-10 justify-between'>
            <div className='w-1/2'>
              <img src={stream.src}/>
            </div>
            <div className='flex flex-col justify-center w-1/2'>
              <h3 className='text-3xl font-bold'>STREAM SPORTS,STREAM PAYMENTS</h3>
              <p className='text-2xl'>
                Enjoy streaming from
                Sports to Games with our Pay as you Go model with
                SUPERFLUID
              </p>
            </div>
          </div>
        </div>

      </main>
    </>
  )
}
