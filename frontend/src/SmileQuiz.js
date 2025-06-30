import React, { useState } from 'react';

const SmileQuiz = ({ onComplete, onSkip }) => {
  const [answers, setAnswers] = useState({
    idealLook: '',
    skinTone: '',
    faceShape: ''
  });
  const [email, setEmail] = useState('');

  const handleAnswerChange = (question, value) => {
    setAnswers(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const handleSubmit = () => {
    // Determine suggested shade based on answers
    let suggestedShade = 'Natural White';
    let suggestedPrompt = '';

    // Logic to suggest shade based on quiz answers
    if (answers.idealLook === 'Hollywood' || answers.idealLook === 'Glamorous') {
      suggestedShade = 'BL1 – Hollywood White';
      suggestedPrompt = 'ultra bright veneers, celebrity white';
    } else if (answers.idealLook === 'Professional') {
      suggestedShade = 'BL2 – Porcelain White';
      suggestedPrompt = 'bright porcelain veneers';
    } else if (answers.skinTone === 'Fair' || answers.skinTone === 'Medium') {
      suggestedShade = 'A1 – Slightly Warm White';
      suggestedPrompt = 'subtle warm white veneers';
    } else if (answers.skinTone === 'Deep' || answers.skinTone === 'Olive') {
      suggestedShade = 'A2 – Natural Yellow Tint';
      suggestedPrompt = 'light natural yellow tint veneers';
    }

    onComplete({
      quizAnswers: answers,
      email,
      suggestedShade,
      suggestedPrompt
    });
  };

  const isComplete = answers.idealLook && answers.skinTone && answers.faceShape;

  return (
    <div className="smile-quiz" style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '30px',
      backgroundColor: '#f8f9fa',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        🎯 Smile Style Quiz
      </h2>
      
      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
          What's your ideal look?
        </label>
        <select 
          value={answers.idealLook}
          onChange={(e) => handleAnswerChange('idealLook', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        >
          <option value="">Select your preference...</option>
          <option value="Natural">Natural</option>
          <option value="Glamorous">Glamorous</option>
          <option value="Hollywood">Hollywood</option>
          <option value="Professional">Professional</option>
        </select>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
          What's your skin tone?
        </label>
        <select 
          value={answers.skinTone}
          onChange={(e) => handleAnswerChange('skinTone', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        >
          <option value="">Select your skin tone...</option>
          <option value="Fair">Fair</option>
          <option value="Medium">Medium</option>
          <option value="Olive">Olive</option>
          <option value="Deep">Deep</option>
        </select>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
          What's your face shape?
        </label>
        <select 
          value={answers.faceShape}
          onChange={(e) => handleAnswerChange('faceShape', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        >
          <option value="">Select your face shape...</option>
          <option value="Oval">Oval</option>
          <option value="Round">Round</option>
          <option value="Square">Square</option>
          <option value="Heart">Heart</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
          Email (optional - for your smile report)
        </label>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button 
          onClick={onSkip}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Skip Quiz
        </button>
        <button 
          onClick={handleSubmit}
          disabled={!isComplete}
          style={{
            padding: '12px 24px',
            backgroundColor: isComplete ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isComplete ? 'pointer' : 'not-allowed',
            fontSize: '16px'
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SmileQuiz; 