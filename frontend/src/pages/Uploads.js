import {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import API from '../api/axios';


function Uploads(){

    const [difficulties, setDifficulites]= useState([]);
    const [selectedDifficulty, setSelectedDifficulites]= useState('');
    const [topic, setTopic]= useState('');
    const [recording, setRecording]= useState(false);
    const [audioBlob, setAudioBlob]= useState(null);
    const [error, setError]= useState('');
    const mediaRecorderRef = useRef(null);
    const navigate = useNavigate();

    const startRecording =async()=> {
        const stream =await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorderRef.current = new MediaRecorder(stream);
        const chunks =[];
        mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorderRef.current.onstop = () => setAudioBlob(new Blob(chunks, { type: 'audio/webm' }));
        mediaRecorderRef.current.start();
        setRecording(true);
    }
    const stopRecording = () => {
       mediaRecorderRef.current.stop();
       setRecording(false);
    } 
    
    
    const handleSubmit = async () => {
     
    const formData = new FormData();
    
  
    formData.append('audio_file', audioBlob, 'audio.webm');
    formData.append('difficulty_level_id', selectedDifficulty);
    formData.append('topic', topic);
   
    try {
        const response = await API.post('/speeches', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        
        navigate(`/analysis/${response.data.id}`);
    } catch (err) {
       
        setError('Failed to submit speech');
    }
}




    useEffect(()=>{
        API.get("/difficulties")
        .then(response => {
            setDifficulites(response.data)
        })
        .catch(error =>{
            console.log(error)
        })

        const topics = ["My favourite holiday", "A person who inspires me", 
        "Technology in daily life", "A challenge I overcame", "My hometown"];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        setTopic(randomTopic)


    }, [])


    return (
        <div>
        <p> Your Topic: {topic}</p>

        <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}> 

        <option value="">Select Difficulty</option>
        {difficulties.map((diff) => (
            <option key={diff.id} value={diff.id}>{diff.name} </option>)
        )}

        </select>

        {error && <p style={{color: 'red'}}>{error}</p>}

        {recording === false && <button onClick={startRecording}>Start Recording</button>}
        {recording === true && <button onClick={stopRecording}>Stop Recording</button>}
        <button onClick={handleSubmit}>Submit</button>
        </div>

       
    )
}

export default Uploads;