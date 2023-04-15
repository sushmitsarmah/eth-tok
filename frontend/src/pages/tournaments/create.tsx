import React, { useState, useEffect } from 'react';
import { useCreateStream, useStream } from '@livepeer/react';

import { client, exploreProfiles } from '../api/lens';

const TournamentForm = () => {
  const [name, setName] = useState('');
  const [tournamentType, setTournamentType] = useState('');
  const [buyInAmount, setBuyInAmount] = useState('');

  const [streamName, setStreamName] = useState<string>('testing');
  const {
    mutate: createStream,
    data: stream,
    status,
  } = useCreateStream(streamName ? { name: streamName } : null);


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  async function fetchProfiles() {
    try {
      /* fetch profiles from Lens API */
      let response = await client.query({ query: exploreProfiles })
      /* loop over profiles, create properly formatted ipfs image links */
      let profileData = await Promise.all(response.data.exploreProfiles.items.map(async profileInfo => {
        let profile = { ...profileInfo }
        let picture = profile.picture
        if (picture && picture.original && picture.original.url) {
          if (picture.original.url.startsWith('ipfs://')) {
            let result = picture.original.url.substring(7, picture.original.url.length)
            profile.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`
          } else {
            profile.avatarUrl = picture.original.url
          }
        }
        return profile
      }))

      /* update the local state with the profiles array */
      // setProfiles(profileData)
    } catch (err) {
      console.log({ err })
    }
  }

  return (
    <div>
      {/* {!active && (
        <button onClick={handleConnect}>
          Connect Wallet
        </button>
      )} */}
      {/* {active && ( */}

      <div>

        <input
          className="input w-full max-w-xs"
          type="text"
          placeholder="Stream name"
          onChange={(e) => setStreamName(e.target.value)}
        />

        <div>
          {!stream && (
            <button
              className='btn btn-secondary'
              onClick={() => {
                createStream?.();
              }}
              disabled={!createStream}
            >
              Create Stream
            </button>
          )}
        </div>
      </div>


      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Tournament Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="type">Tournament Type:</label>
          <input
            id="type"
            type="text"
            value={tournamentType}
            onChange={(event) => setTournamentType(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="buyIn">Buy-in Amount (in ETH):</label>
          <input
            id="buyIn"
            type="text"
            value={buyInAmount}
            onChange={(event) => setBuyInAmount(event.target.value)}
          />
        </div>

        <button type="submit">
          Create Tournament
        </button>
      </form>
      {/* )} */}
    </div>
  );
};

export default function TournamentsForm() {
  return (
    <TournamentForm />
  )
};
