export default function WelcomeSection({ onStart }) {
    return (
      <div className="welcome-section">
        <h1>CampAIgn</h1>
        <p className="description">
          Automate your Google Ads campaign creation with AI. Simply chat with our assistant, 
          answer a few questions, and we'll set up your campaign automatically.
        </p>
        <button className="start-button" onClick={onStart}>
          Start a new campaign
        </button>
      </div>
    );
  }