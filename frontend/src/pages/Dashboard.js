import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import API from '../api/axios';
import './Dashboard.css';


function Dashboard(){
    const [speeches, setSpeeches] = useState([]);
    const [error, setError] = useState('');
    const name = localStorage.getItem('name');
    const navigate = useNavigate();

    useEffect(()=>{
        API.get('/speeches', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(response => setSpeeches(response.data))
        .catch(() => setError('Failed to load dashboard data.'))
    }, [])

    // Calculate streak
    const calculateStreak = () => {
        if (speeches.length === 0) return 0;
        const uniqueDates = [...new Set(speeches.map(s => 
            new Date(s.date).toLocaleDateString()
        ))].sort((a, b) => new Date(b) - new Date(a));

        let streak = 0;
        let current = new Date();
        current.setHours(0, 0, 0, 0);

        for (let date of uniqueDates) {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            const diff = (current - d) / (1000 * 60 * 60 * 24);
            if (diff <= 1) { streak++; current = d; }
            else break;
        }
        return streak;
    }

    const totalSpeeches = speeches.length;
    const streak = calculateStreak();
    const recentSpeech = speeches[speeches.length - 1];

    return (
        <div className="dashboard-page">
            <h1 className="dashboard-welcome">Good day, {name}! 👋</h1>
            <p className="dashboard-subtitle">Here's your speech practice summary.</p>

            {error && <p style={{color:'red'}}>{error}</p>}

            {/* Stats Row */}
            <div className="dashboard-stats">
                <div className="stat-card yellow">
                    <p className="stat-label">Total Speeches</p>
                    <p className="stat-value">{totalSpeeches}</p>
                </div>
                <div className="stat-card pink">
                    <p className="stat-label">Daily Streak</p>
                    <p className="stat-value">{streak} 🔥</p>
                </div>
            </div>

            {/* Recent Speech */}
            {recentSpeech && (
                <div className="recent-card">
                    <h2>Most Recent Speech</h2>
                    <p className="recent-topic">{recentSpeech.topic}</p>
                    <p className="recent-meta">
                        {new Date(recentSpeech.date).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric'
                        })}
                        &nbsp;·&nbsp;
                        {Math.floor(recentSpeech.duration / 60)}m {recentSpeech.duration % 60}s
                    </p>
                    <button className="view-btn" onClick={() => navigate(`/analysis/${recentSpeech.id}`)}>
                        View Analysis
                    </button>
                </div>
            )}

            {/* Start New Speech */}
            <button className="new-speech-btn" onClick={() => navigate('/uploads')}>
                🎙 Start New Speech
            </button>
        </div>
    )
}

export default Dashboard;