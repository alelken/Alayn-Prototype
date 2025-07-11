const exercises = [
  { title: 'Breathing Basics', free: true },
  { title: 'Guided Chakra Meditation', free: false },
  { title: 'Morning Yoga Flow', free: false },
];

export default function MindfulExercises() {
  return (
    <div className="container">
      <h1>Mindful Exercises</h1>
      <div className="list">
        {exercises.map((ex) => (
          <div key={ex.title} className="item-card">
            <div className="avatar-placeholder" />
            <div className="item-info">
              <h2>{ex.title}</h2>
              <p>{ex.free ? 'Free' : 'Premium'}</p>
              <button className="btn" disabled={!ex.free}>
                {ex.free ? 'Start' : 'Locked'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
