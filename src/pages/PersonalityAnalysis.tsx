import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import BottomNav from '../components/BottomNav';
import { colors } from '../theme';


export default function PersonalityAnalysis() {
  // Dummy data for demonstration
  const questions = [
    { title: 'Openness', text: 'Do you enjoy new experiences?', name: 'openness' },
    { title: 'Conscientiousness', text: 'Are you organized and responsible?', name: 'conscientiousness' },
  ];
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<{ [key: string]: string }>({});
  const [completed, setCompleted] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setCompleted(true);
      localStorage.setItem(
        'progress',
        JSON.stringify({ ...(JSON.parse(localStorage.getItem('progress') || '{}')), analysis: 1 })
      );
    }
  };

  const yesCount = Object.values(answers).filter(a => a === 'Yes').length;

  return (
    <div className="dashboard-bg">
      <div className="container">
        <SectionTitle>Personality Analysis</SectionTitle>
        {!completed ? (
          <>
            <Card>
              <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                {questions.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      background: i <= step ? colors.green : '#eee',
                      transition: 'background 0.2s',
                    }}
                  />
                ))}
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.9em', color: colors.gray, marginTop: 4 }}>
                Step {step + 1} of {questions.length}
              </div>
            </Card>
            <form onSubmit={handleNext}>
              <Card>
                <div>
                  <SectionTitle>{questions[step].title}</SectionTitle>
                  <p>{questions[step].text}</p>
                  <label style={{ marginRight: 16 }}>
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
              </Card>
              <button type="submit" className="btn mt-md">
                {step < questions.length - 1 ? 'Next' : 'Submit'}
              </button>
            </form>
          </>
        ) : (
          <Card>
            <SectionTitle>Result</SectionTitle>
            <p>You answered "Yes" to {yesCount} of {questions.length} questions.</p>
            <p>This is a sample personality analysis result.</p>
          </Card>
        )}
        <div style={{ height: 72 }} />
      </div>
      <BottomNav />
    </div>
  );
}
