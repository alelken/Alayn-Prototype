import React, { useState } from 'react';

const questions = [
  {
    title: 'Question 1',
    text: 'Do you enjoy working in teams?',
    name: 'q1',
  },
  {
    title: 'Question 2',
    text: 'Do you prefer detailed plans over spontaneity?',
    name: 'q2',
  },
  {
    title: 'Question 3',
    text: 'Do you easily adapt to new environments?',
    name: 'q3',
  },
];

export default function PersonalityAnalysis() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({ ...answers, [questions[step].name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Submit logic here
      alert('Submitted!');
    }
  };

  return (
    <div className="container">
      <h1>Personality Analysis</h1>
      <div className="mb-md">
        <div style={{ display: 'flex', gap: 4 }}>
          {questions.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                background: i <= step ? 'var(--color-peacock)' : '#eee',
                transition: 'background 0.2s',
              }}
            />
          ))}
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.9em', color: 'var(--color-peacock)', marginTop: 4 }}>
          Step {step + 1} of {questions.length}
        </div>
      </div>
      <form className="list" onSubmit={handleNext}>
        <div className="item-card">
          <div className="item-info">
            <h2>{questions[step].title}</h2>
            <p>{questions[step].text}</p>
            <label>
              <input
                type="radio"
                name={questions[step].name}
                value="Yes"
                checked={answers[questions[step].name] === 'Yes'}
                onChange={handleChange}
                required
              />{' '}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={questions[step].name}
                value="No"
                checked={answers[questions[step].name] === 'No'}
                onChange={handleChange}
                required
              />{' '}
              No
            </label>
          </div>
        </div>
        <button type="submit" className="btn mt-md">
          {step < questions.length - 1 ? 'Next' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
