const therapists = [
  { name: 'Dr. Asha Singh', specialty: 'Career Counselling', fee: 1500 },
  { name: 'Dr. Ravi Kumar', specialty: 'Parental Advice', fee: 1200 },
  { name: 'Dr. Meera Das', specialty: 'Stress Management', fee: 1000 },
];

export default function VideoTherapy() {
  return (
    <div className="container">
      <h1>Real-time Video Therapy</h1>
      <div className="list">
        {therapists.map((t) => (
          <div key={t.name} className="item-card">
            <div className="avatar-placeholder" />
            <div className="item-info">
              <h2>{t.name}</h2>
              <p>{t.specialty}</p>
              <p>₹{t.fee}</p>
              <button className="btn">Book Session</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
