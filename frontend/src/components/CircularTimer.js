function CircularTimer({ totalTime, currentTime, color, onSkip }) {
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const progress = currentTime / totalTime;
    const dashOffset = circumference * (1 - progress);

    return (
        <div className="circular-timer">
            <svg width="320" height="320" viewBox="0 0 320 320">
                <circle cx="160" cy="160" r={radius}
                    fill="none" stroke="#e8e3d8" strokeWidth="16" />
                <circle cx="160" cy="160" r={radius}
                    fill="none" stroke={color} strokeWidth="16"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 160 160)" />
            </svg>
            <div className="timer-text">
                <span className="timer-number">{currentTime}</span>
                <span className="timer-label">seconds</span>
                {onSkip && <button className="skip-btn" onClick={onSkip}>Skip</button>}
            </div>
        </div>
    );
}

export default CircularTimer;