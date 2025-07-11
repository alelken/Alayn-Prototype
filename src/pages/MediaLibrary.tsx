const media = [
  { title: 'Gandhi: Power of Persistence', free: true },
  { title: 'Chanakya: Strategy and Wisdom', free: true },
  { title: 'Mother Teresa: Compassion in Action', free: false },
];

export default function MediaLibrary() {
  return (
    <div className="container">
      <h1>Media Library</h1>
      <div className="list">
        {media.map((m) => (
          <div key={m.title} className="item-card">
            <div className="avatar-placeholder" />
            <div className="item-info">
              <h2>{m.title}</h2>
              <p>{m.free ? 'Free' : 'Premium'}</p>
              <button className="btn" disabled={!m.free}>
                {m.free ? 'Play' : 'Locked'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
