import { Player } from '@livepeer/react';
import { useMemo, useState, useEffect } from 'react';

const streamId = 'c65410ef-e23b-49a5-9c5b-f753721f18c2';

const Tournament = () => {
    const [streamInfo, setStreamInfo] = useState<any>('');
    const [qsVal, setQsVal] = useState<string>('');
    const [bets, setBets] = useState<any[]>([]);

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
        if(answer === 'yes') {
            qs.yes += 1;
        } else {
            qs.no += 1;
        }
        setBets([...bets]);
    };

    return (
        <div className='flex flex-col gap-4'>

            <h1 className='font-bold text-3xl'>Tournament Live Stream</h1>

            {streamInfo ? (
                <div className="">
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
