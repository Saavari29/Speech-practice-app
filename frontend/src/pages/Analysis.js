import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import API from '../api/axios';

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
        <div>
            <h1>Analysis</h1>

            <p>Transcript: {analysis.transcript_highlighted}</p>
            <p>Filler word count: {analysis.filler_words_count}</p>
            <p>Pace: {analysis.pace_wpm}</p>
            <p>Relevance score: {analysis.relevance_score}</p>
            <p>Tone consistency score: {analysis.tone_consistency_score}</p>
            <p>Overall feedback: {analysis.overall_feedback}</p>
        </div>
    )
}

export default Analysis;