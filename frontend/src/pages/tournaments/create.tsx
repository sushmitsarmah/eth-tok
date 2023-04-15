import React, { useState, useEffect } from 'react';
import { useCreateStream, useStream } from '@livepeer/react';
import { client, exploreProfiles } from '../api/lens';

const HUDDLE_API_KEY = "VwTZ4AGTxme9snANex9tep3NwvVMGfYd";

const TournamentForm = () => {
  const [name, setName] = useState('');
  const [tournamentType, setTournamentType] = useState('');
  const [buyInAmount, setBuyInAmount] = useState('');

  const [streamName, setStreamName] = useState<string>('testing');
  const [huddleRoom, setHuddleRoom] = useState<string>('');
  const [huddleMeeting, setHuddleMeeting] = useState<string>('');

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
      let profileData = await Promise.all(response.data.exploreProfiles.items
        .map(async (profileInfo: any) => {
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

  const createHuddleRoom = async () => {
    const opts: any = {
      method: "POST",
      data: {
        title: "Huddle01-Test",
        hostWallets: ['0x29f54719E88332e70550cf8737293436E9d7b10b']
      },
      headers: {
        "Content-type": "application/json",
        'x-api-key': HUDDLE_API_KEY,
      }
    };
    const resp: any = await fetch(
      "https://iriko.testing.huddle01.com/api/v1/create-room",
      opts
    );
    const roomId = resp?.data?.roomId;
    const meetingLink = resp?.data?.meetingLink;
    setHuddleRoom(roomId);
    setHuddleMeeting(meetingLink);
  };

return (
  <div>
    {/* {!active && (
        <button onClick={handleConnect}>
          Connect Wallet
        </button>
      )} */}
    {/* {active && ( */}

    <div className='flex flex-row gap-4'>
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

    <div>
      <button className='btn btn-primary' onClick={createHuddleRoom}>Create Huddle Room</button>
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
