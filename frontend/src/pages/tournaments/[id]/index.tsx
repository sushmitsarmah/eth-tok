import { Player } from '@livepeer/react';
import { useMemo, useState, useEffect } from 'react';
import { useHuddle01 } from '@huddle01/react';
import { useLobby, useAudio, useVideo, useRoom, usePeers } from '@huddle01/react/hooks';
import { Video, Audio } from '@huddle01/react/components'


const streamId = 'c65410ef-e23b-49a5-9c5b-f753721f18c2';

const Tournament = () => {
    const [streamInfo, setStreamInfo] = useState<any>('');
    const [qsVal, setQsVal] = useState<string>('');
    const [bets, setBets] = useState<any[]>([]);
    const { initialize, isInitialized } = useHuddle01();
    const { joinLobby } = useLobby();
    const {
        fetchAudioStream, stopAudioStream, error: micError,
        produceAudio, stopProducingAudio
    } = useAudio();

    const {
        fetchVideoStream, stopVideoStream, error: camError,
        produceVideo, stopProducingVideo
    } = useVideo();
    const { joinRoom, leaveRoom } = useRoom();

    const { peerIds } = usePeers();

    const getStream = async () => {
        const res = await fetch(
            `https://livepeer.studio/api/stream/${streamId}`,
            {
                headers: {
                    Authorization: `Bearer 9fa657e8-fe18-4b6e-94b9-106353efffac`,
                    'Content-Type': 'application/json',
                }
            });

        const data = await res.json();

        console.log(data);

        setStreamInfo(data);
    }

    // const isLoading = useMemo(() => status === 'loading', [status]);

    useEffect(() => {
        console.log('fetching stream')
        getStream();
    }, []);

    const onQsChange = (e: any) => {
        setQsVal(e.target.value)
    };

    const postQs = () => {
        console.log(qsVal);
        setBets([...bets, {
            question: qsVal,
            yes: 0,
            no: 0
        }])
        setQsVal('');
    };

    const answered = (qs: any, answer: string) => {
        if (answer === 'yes') {
            qs.yes += 1;
        } else {
            qs.no += 1;
        }
        setBets([...bets]);
    };

    return (
        <div className='flex flex-col gap-4'>

            <h1 className='font-bold text-3xl'>Tournament Live Stream</h1>

            <div className='flex flex-row gap-4 w-full'>
                {streamInfo ? (
                    <div className="w-1/2">
                        {streamInfo.isActive ? (
                            <div>
                                <Player
                                    playbackId={`${streamInfo.playbackId}`}
                                    autoPlay={true}
                                    loop
                                    muted
                                    controls={{ autohide: 0, hotkeys: false }}
                                />
                                <p>Stream Status:</p>
                                <p className="">Live Now!</p>
                                <p> {streamInfo.name} </p>
                            </div>
                        ) : (
                            <>
                                <img src="" alt='Livepeer Studio Logo' width='50' height='50' />
                                <h2> {streamInfo.name} </h2>
                                <p>Stream Status:</p>
                            </>
                        )}
                    </div>
                ) : ''}
            </div>

            <div className='flex flex-col gap-4 w-full'>
                {isInitialized ? 'Hello World!' : 'Please initialize'}
                <button
                    disabled={joinLobby.isCallable}
                    onClick={() => joinLobby('YOUR_ROOM_ID')
                    }>
                    Join Lobby
                </button>

                <div className="grid grid-cols-4">
                    {peerIds.map((peer: any) => (
                        <>
                            <Video key={peer.peerId} peerId={peer.peerId} debug />
                            <button disabled={!produceVideo.isCallable} onClick={() => produceVideo(peer.cam)}>
                                Produce Cam
                            </button>
                        </>
                    ))}

                    {peerIds.map((peer: any) => (
                        <>
                            <Audio key={peer.peerId} peerId={peer.peerId} debug />
                            <button disabled={!produceAudio.isCallable} onClick={() => produceAudio(peer.mic)}>
                                Produce Mic
                            </button>
                        </>
                    ))}

                </div>

                <div className='grid grid-cols-4 gap-4'>

                    {/* Mic */}
                    <button disabled={!fetchAudioStream.isCallable} onClick={fetchAudioStream}>
                        FETCH_AUDIO_STREAM
                    </button>

                    {/* Webcam */}
                    <button disabled={!fetchVideoStream.isCallable} onClick={fetchVideoStream}>
                        FETCH_VIDEO_STREAM
                    </button>

                    <button disabled={!joinRoom.isCallable} onClick={joinRoom}>
                        JOIN_ROOM
                    </button>

                    <button disabled={!leaveRoom.isCallable} onClick={leaveRoom}>
                        LEAVE_ROOM
                    </button>

                    <button disabled={!stopProducingVideo.isCallable} onClick={stopProducingVideo}>
                        Stop Producing Cam
                    </button>

                    <button disabled={!stopProducingAudio.isCallable} onClick={stopProducingAudio}>
                        Stop Producing Mic
                    </button>
                </div>
            </div>


            <div className='flex flex-row gap-4'>
                <input type="text"
                    value={qsVal}
                    placeholder="Type your question"
                    className="input input-bordered w-full max-w-xs"
                    onChange={onQsChange}
                />
                <button className='btn btn-secondary' onClick={postQs}>Post Bet Question</button>
            </div>

            <div className='grid grid-cols-4 gap-10'>
                {bets.map((k: any, i: number) =>
                    <div key={i} className="card bg-white text-black">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">{k.question}</h2>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary" onClick={() => answered(k, 'yes')}>Yes</button>
                                <button className="btn btn-error" onClick={() => answered(k, 'no')}>No</button>
                            </div>
                            <div className='card-footer grid grid-cols-4'>
                                <p>Yes</p>
                                <p>{k.yes}</p>
                                <p>No</p>
                                <p>{k.no}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
};

export default Tournament;
