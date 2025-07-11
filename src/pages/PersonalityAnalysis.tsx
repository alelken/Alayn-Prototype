import React from 'react';
import { FaBookOpen, FaDumbbell, FaUserCircle, FaHome, FaStar } from 'react-icons/fa';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import Navbar from '../components/Navbar';
import { colors } from '../theme';

const navItems = [
  { icon: <FaHome />, label: 'Home', onClick: () => window.location.pathname = '/' },
  { icon: <FaDumbbell />, label: 'Exercises', onClick: () => window.location.pathname = '/mindful-exercises' },
  { icon: <FaBookOpen />, label: 'Library', onClick: () => window.location.pathname = '/media-library' },
  { icon: <FaStar />, label: 'Analysis', active: true, onClick: () => window.location.pathname = '/personality-analysis' },
];

export default function PersonalityAnalysis() {
  // Dummy data for demonstration
  const questions = [
    { title: 'Openness', text: 'Do you enjoy new experiences?', name: 'openness' },
    { title: 'Conscientiousness', text: 'Are you organized and responsible?', name: 'conscientiousness' },
  ];
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < questions.length - 1) setStep(step + 1);
    // else: submit logic
  };

  return (
    <div className="dashboard-bg">
      <div className="container">
        <SectionTitle>Personality Analysis</SectionTitle>
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
        <div style={{ height: 72 }} />
      </div>
      <Navbar items={navItems} />
    </div>
  );
}
