export default function PersonalityAnalysis() {
  return (
    <div className="container">
      <h1>Personality Analysis</h1>
      <form className="list">
        <div className="item-card">
          <div className="item-info">
            <h2>Question 1</h2>
            <p>Do you enjoy working in teams?</p>
            <label>
              <input type="radio" name="q1" /> Yes
            </label>
            <label>
              <input type="radio" name="q1" /> No
            </label>
          </div>
        </div>
        <div className="item-card">
          <div className="item-info">
            <h2>Question 2</h2>
            <p>Do you prefer detailed plans over spontaneity?</p>
            <label>
              <input type="radio" name="q2" /> Yes
            </label>
            <label>
              <input type="radio" name="q2" /> No
            </label>
          </div>
        </div>
        <div className="item-card">
          <div className="item-info">
            <h2>Question 3</h2>
            <p>Do you easily adapt to new environments?</p>
            <label>
              <input type="radio" name="q3" /> Yes
            </label>
            <label>
              <input type="radio" name="q3" /> No
            </label>
          </div>
        </div>
        <button type="submit" className="btn">Submit</button>
      </form>
    </div>
  );
}
