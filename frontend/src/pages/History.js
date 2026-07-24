import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import API from '../api/axios';
import './History.css';

function History(){

    const [speechlist, setSpeechList] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        API.get('/speeches',{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => setSpeechList(response.data))
        .catch(() => setError('Failed to load the speech list. Please try again.'))
    },[])

    if (error) return <p style={{color:'red'}}>{error}</p>;
    if (speechlist.length === 0) return <p>No speeches yet.</p>;

    return(
        <div className="history-page">
            <h1>Speech History</h1>
            <div className="speech-list">
                {speechlist.map((speech, index) => (
                    <div className="speech-card" key={speech.id} style={{
                        borderLeft: `5px solid ${index % 3 === 0 ? 'var(--yellow)' : index % 3 === 1 ? 'var(--pink)' : 'var(--green)'}`
                    }}>
                        <div className="speech-card-info">
                            <p className="speech-topic">{speech.topic}</p>
                            <p className="speech-meta">
                                {new Date(speech.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                &nbsp;·&nbsp;
                                {Math.floor(speech.duration / 60)}m {speech.duration % 60}s
                            </p>
                        </div>
                        <button className="view-btn" onClick={() => navigate(`/analysis/${speech.id}`)}>
                            View Analysis
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default History;