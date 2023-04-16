import FlappyBird from "./FlappyBird"

const scorers = [
    { address: "0x293492839fksjfhksddfg8948934", score: 10 },
    { address: "0x293sddfg8948934jkjdklfglio23", score: 6 },
    { address: "0x12cdff434fksjfhksddfg8948934", score: 4 },
    { address: "0x198763839fksjfhksddfg8948934", score: 3 },
]

export default function Game() {
    return (
        <div className="flex flex-row gap-4 justify-between">
            <FlappyBird />
            <div className="flex flex-col gap-4 w-1/2">
                <h1 className="font-bold text-2xl">Flappy Bird LeaderBoard</h1>
                <div className="grid grid-cols-2">
                    {scorers.map((k, i) => 
                        <>
                            <div>{k.address}</div>
                            <div>{k.score}</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
};