import Img from '../../assets/images/asphalt.png';

const vals = [
  {
    id: 1,
    img: Img.src,
    name: '',
    title: '',
    hosted_by: ''
  },
  {
    id: 2,
    img: Img.src,
    name: '',
    title: '',
    hosted_by: ''
  },
  {
    id: 3,
    img: Img.src,
    name: '',
    title: '',
    hosted_by: ''
  },
  {
    id: 4,
    img: Img.src,
    name: '',
    title: '',
    hosted_by: ''
  },
  {
    id: 5,
    img: Img.src,
    name: '',
    title: '',
    hosted_by: ''
  },
  {
    id: 6,
    img: Img.src,
    name: '',
    title: '',
    hosted_by: ''
  },
];

export default function Tournaments() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {vals.map(k => 
        <div className="card card-compact bg-base-100 shadow-xl" key={k.id}>
          <figure><img src={k.img} alt="Shoes" /></figure>
          <div className="card-body">
            <h2 className="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div className="card-actions flex flex-row justify-between">
              <button className="btn btn-ghost">Apr 16</button>
              <button className="btn btn-primary w-1/2">$100</button>
            </div>
          </div>
        </div>  
      )}
    </div>
  )
};