import Link from 'next/link';
import Img from '../../assets/images/flappybird.png';
const vals = [
    {
        id: 1,
        img: Img.src,
        name: 'Flappy Bird',
        title: '',
        hosted_by: '',
        url: '/games/flappybird'
    },
];

export default function Games() {
    return (
        <div className="grid grid-cols-3 gap-4">
            {vals.map(k =>
                <div className="card card-compact bg-base-100 shadow-xl" key={k.id}>
                    <Link href={k.url}>
                        <figure><img src={k.img} alt="Shoes" /></figure>
                        <div className="card-body">
                            <h2 className="card-title">{k.name}</h2>
                            <div className="card-actions flex flex-row justify-between">
                                <button className="btn btn-primary w-1/2">$10</button>
                            </div>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    )
};
