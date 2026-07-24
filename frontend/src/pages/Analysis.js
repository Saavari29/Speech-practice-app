import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import API from '../api/axios';
import './Analysis.css';

function Analysis(){


    const [analysis, setAnalysis] = useState(null);
    const [error, setError]= useState('');
    const {speechId} = useParams();

    useEffect(()=>{
        API.get(`/analysis/${speechId}`,{
            headers: {
                 Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response =>{
            setAnalysis(response.data)
        })
        .catch(error => {
            setError('Failed to load analysis. Please try again.');
        })
    }, []);

    if (error) return <p style={{color: 'red'}}>{error}</p>;
    if (!analysis) return <p>Loading...</p>;

 return (
    <div className="analysis-page">
        <h1>Your Analysis</h1>

        <div className="scores-container">
            <div className="score-card yellow">
                <p className="score-label">Filler Words</p>
                <p className="score-value">{analysis.filler_words_count}</p>
            </div>
            <div className="score-card pink">
                <p className="score-label">Pace</p>
                <p className="score-value">{analysis.pace_wpm} <span>wpm</span></p>
            </div>
            <div className="score-card green">
                <p className="score-label">Relevance</p>
                <p className="score-value">{analysis.relevance_score}<span>/10</span></p>
            </div>
            <div className="score-card yellow">
                <p className="score-label">Tone</p>
                <p className="score-value">{analysis.tone_consistency_score}<span>/10</span></p>
            </div>
        </div>

        <div className="transcript-box">
            <h2>Transcript</h2>
            <p>{analysis.transcript_highlighted}</p>
        </div>

        <div className="feedback-box">
            <h2>Overall Feedback</h2>
            <p>{analysis.overall_feedback}</p>
        </div>
    </div>
 )
}

export default Analysis;