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

export default function Workshops() {
  return (
    <div className="container">
      <h1>Therapist Videos & Workshops</h1>
      <div className="list">
        {workshops.map((w) => (
          <div key={w.title} className="item-card">
            <div className="avatar-placeholder" />
            <div className="item-info">
              <h2>{w.title}</h2>
              <p>{w.date}</p>
              <p>₹{w.price}</p>
              <button className="btn">Buy Ticket</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
