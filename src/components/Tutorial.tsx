import { useState } from 'react';

interface Props {
  onDismiss: () => void;
}

interface Step {
  title: string;
  content: string;
  highlight: string; // description of what to highlight
}

const STEPS: Step[] = [
  {
    title: 'Welcome to Bali Bagus 🏝️',
    content:
      'Your Bali land investment intelligence platform. Discover the best zones to invest in Bali & Lombok.',
    highlight: 'center',
  },
  {
    title: 'The Map',
    content:
      'Each colored circle represents an investment zone. Size reflects activity. Color = score (green = great, red = avoid). Click any circle for details.',
    highlight: 'map',
  },
  {
    title: 'Scoring Weights',
    content:
      'Use the sliders on the left to adjust what matters most to you: rental yield, land price, accessibility, etc. Scores update in real time.',
    highlight: 'left',
  },
  {
    title: 'Comparing Zones',
    content:
      "Click 'Compare zones' on multiple zones to compare them side by side. Up to 3 zones at once.",
    highlight: 'left',
  },
  {
    title: 'News & World',
    content:
      'Use the 📰 News button for the latest Bali real estate news, and 🌍 World to compare global investment markets.',
    highlight: 'top',
  },
];

// Spotlight positions based on highlight hint
function getSpotlight(highlight: string): React.CSSProperties {
  if (highlight === 'left') {
    return { top: '50%', left: '12.5%', transform: 'translate(-50%, -50%)', width: '25%', height: '80%' };
  }
  if (highlight === 'map') {
    return { top: '50%', left: '62.5%', transform: 'translate(-50%, -50%)', width: '75%', height: '80%' };
  }
  if (highlight === 'top') {
    return { top: '4%', left: '50%', transform: 'translate(-50%, 0)', width: '80%', height: '8%' };
  }
  // center / default — no spotlight box
  return {};
}

export default function Tutorial({ onDismiss }: Props) {
  const [step, setStep] = useState(0);

  const currentStep = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const spotlight = getSpotlight(currentStep.highlight);

  const handleNext = () => {
    if (isLast) {
      onDismiss();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) setStep((s) => s - 1);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Spotlight border glow (shows which UI area the step is about) */}
      {currentStep.highlight !== 'center' && Object.keys(spotlight).length > 0 && (
        <div
          style={{
            position: 'absolute',
            borderRadius: '12px',
            border: '2px solid #c0392b',
            boxShadow: '0 0 0 4px rgba(192,57,43,0.25), 0 0 24px rgba(192,57,43,0.3)',
            pointerEvents: 'none',
            transition: 'all 0.3s ease',
            ...spotlight,
          }}
        />
      )}

      {/* Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '440px',
          width: '90vw',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Close button */}
        <button
          onClick={onDismiss}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#9c8877',
            fontSize: '20px',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '2px 6px',
            borderRadius: '4px',
          }}
          aria-label="Close tutorial"
        >
          ×
        </button>

        {/* Step indicator dots */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? '20px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === step ? '#c0392b' : '#e8e0d5',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Step counter */}
        <div style={{ fontSize: '11px', color: '#9c8877', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          Step {step + 1} of {STEPS.length}
        </div>

        {/* Title */}
        <h2
          style={{
            margin: '0 0 12px',
            fontSize: '20px',
            fontWeight: 800,
            color: '#1a1410',
            lineHeight: 1.3,
          }}
        >
          {currentStep.title}
        </h2>

        {/* Content */}
        <p
          style={{
            margin: '0 0 28px',
            fontSize: '14px',
            color: '#6b5c4e',
            lineHeight: 1.6,
          }}
        >
          {currentStep.content}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          {/* Skip */}
          <button
            onClick={onDismiss}
            style={{
              background: 'none',
              border: 'none',
              color: '#9c8877',
              fontSize: '13px',
              cursor: 'pointer',
              padding: '8px 0',
              textDecoration: 'underline',
            }}
          >
            Skip
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Back */}
            {!isFirst && (
              <button
                onClick={handleBack}
                style={{
                  background: 'none',
                  border: '1px solid #e8e0d5',
                  borderRadius: '8px',
                  color: '#6b5c4e',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '10px 18px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                ← Back
              </button>
            )}

            {/* Next / Finish */}
            <button
              onClick={handleNext}
              style={{
                background: '#c0392b',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                padding: '10px 20px',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {isLast ? 'Start Exploring →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
