import React from 'react';
import { FaChalkboardTeacher } from 'react-icons/fa';

const workshops = [
  {
    title: 'Mindful Parenting Basics',
    date: '12 Aug 2025',
    price: 500,
  },
  {
    title: 'Career Growth Strategies',
    date: '20 Aug 2025',
    price: 650,
  },
];

function WorkshopCard({ title, date, price }: { title: string; date: string; price: number }) {
  return (
    <div className="item-card">
      <div className="avatar-placeholder"><FaChalkboardTeacher /></div>
      <div className="item-info">
        <h2>{title} <span className="badge badge-premium">Paid</span></h2>
        <p>{date}</p>
        <p>₹{price}</p>
        <button className="btn">Buy Ticket</button>
      </div>
    </div>
  );
}

export default function Workshops() {
  return (
    <div className="container fade-in">
      <h1>Therapist Videos & Workshops</h1>
      <div className="grid-list">
        {workshops.map((w) => (
          <WorkshopCard key={w.title} {...w} />
        ))}
      </div>
    </div>
  );
}
