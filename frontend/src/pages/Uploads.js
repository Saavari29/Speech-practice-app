import {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import API from '../api/axios';
import './Uploads.css';


function Uploads(){

    const [difficulties, setDifficulites]= useState([]);
    const [selectedDifficulty, setSelectedDifficulty]= useState('');
    const [topic, setTopic]= useState('');
    const [recording, setRecording]= useState(false);
    const [audioBlob, setAudioBlob]= useState(null);
    const [error, setError]= useState('');
    const mediaRecorderRef = useRef(null);
    const recordingStartRef = useRef(null);
    const [preptime, setPrepTime]= useState(0);
    const [step, setStep] = useState('select');
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);
    const [selectedPrepTime, setSelectedPrepTime] = useState(0);

    const startRecording =async()=> {
        const stream =await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorderRef.current = new MediaRecorder(stream);
        const chunks =[];
        mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorderRef.current.onstop = () => setAudioBlob(new Blob(chunks, { type: 'audio/webm' }));
        mediaRecorderRef.current.start();
        recordingStartRef.current = Date.now();
        setRecording(true);
        
    }
    const stopRecording = () => {
       mediaRecorderRef.current.stop();
       setRecording(false);
    } 
    
    
    const handleSubmit = async () => {

        if(!audioBlob){
            setError('Please record your speech first.');
            return;
        }
        if(!selectedDifficulty){
            setError('Please select a difficulty level.');
            return;
        }

     
       const formData = new FormData();
       const duration = Math.round((Date.now() - recordingStartRef.current) / 1000);
       formData.append('duration', duration);
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
            const message =err.response?.data?.detail||'Failed to submit speech. Please try again.';
            setError(message);   
        }
    }

    useEffect(()=>{
        API.get("/difficulties")
        .then(response => {
            setDifficulites(response.data)
        })
        .catch(error =>{
            setError('Failed to load difficulties. Please refresh the page.');
        })
        
        const topics = ["My favourite holiday", "A person who inspires me", 
        "Technology in daily life", "A challenge I overcame", "My hometown"];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        setTopic(randomTopic)


    }, [])

    useEffect(()=>{
        if (countdown <=0) return;
        const count = setInterval(()=>{
            setCountdown(prev=>{
                if(prev<=1){
                    clearInterval(count);
                    setPrepTime(selectedPrepTime);
                    return 0;
                }
                return prev - 1;
            })
        },1000);
        return () => clearInterval(count);
    },[countdown])

    useEffect(()=>{
        if(preptime <= 0) return;
        const timer = setInterval(()=>{
            setPrepTime(prev=>{
                if (prev<=1){
                    clearInterval(timer);
                    startRecording();
                    return 0;
                }
                return prev -1;
            })
        },1000);
        return()=> clearInterval(timer);
    },[preptime])

    

   if(step==='record'){
    return(
        <div className="topic-page">
          <p>Topic: {topic}</p>
          {countdown > 0 && <p>Get ready... {countdown}</p>}
          {countdown === 0 && preptime > 0 && (
            <div>
                <p>Prepare yourself... {preptime} seconds</p>
                <button onClick={() => {
                    setPrepTime(0);
                    startRecording();
                }}>Skip</button>
            </div>
          )}
          {error && <p style={{color:'red'}}>{error}</p>}
          {recording && <button onClick={stopRecording}>Stop Recording</button>}
          {audioBlob && <button onClick={handleSubmit}>Submit</button>}
        </div>
    )
   }


    if(step=== 'select'){
         return(
            <div className="select-container">
                <h1>Select your difficulty level</h1>
                    <div className="cards-container">
                        {difficulties.map((diff) => (
                    <div className="difficulty-card" key={diff.id} onClick={()=>{
                        setSelectedDifficulty(diff.id);
                        setSelectedPrepTime(diff.prep_time); 
                        setCountdown(5);
                        setStep('record');
                    }}>
                        <h2>{diff.name}</h2>
                        <p>{diff.description}</p>
                        <p>Duration: {Math.round(diff.min_duration / 60)} mins</p>
                        <p>Prep time: {Math.round(diff.prep_time / 60)} mins</p>
                    </div>

                    ))}
                </div>
            </div>
        )
    }


}

export default Uploads;