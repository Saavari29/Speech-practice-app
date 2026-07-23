import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import API from '../api/axios';

function History(){

    const [speechlist, setSpeechList]= useState([]);
    const [error, setError]= useState('');
    const navigate = useNavigate();


    useEffect(()=>{
        API.get('/speeches',{
             headers: {
                 Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setSpeechList(response.data)
        })
        .catch(error =>{
            setError('Failed to load the speech list. Please try agian.')
        })
    },[])

    if(speechlist.length === 0) return <p>No speeches yet.</p>;

    return(
        <div>
            <h1>Speech History</h1>
            {error&& <p style={{color:'red'}}>{error}</p>}
            {speechlist.map((speech)=> (
                <div key ={speech.id}>
                    <p>Topic: {speech.topic}</p>
                    <p>Date: {speech.date}</p>
                    <p>Duration: {speech.duration}</p>
                    <button onClick={() => navigate(`/analysis/${speech.id}`)}>View Analysis</button>

                </div>
            ))}

        </div>
    )
}

export default History;
