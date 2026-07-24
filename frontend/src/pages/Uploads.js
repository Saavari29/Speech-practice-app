import {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import API from '../api/axios';
import './Uploads.css';
import CircularTimer from '../components/CircularTimer';

function Uploads(){

    // State
    const [difficulties, setDifficulites] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [selectedPrepTime, setSelectedPrepTime] = useState(0);
    const [topic, setTopic] = useState('');
    const [step, setStep] = useState('select');
    const [countdown, setCountdown] = useState(0);
    const [preptime, setPrepTime] = useState(0);
    const [recording, setRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [error, setError] = useState('');
    const [selectedDuration, setSelectedDuration] = useState(0);

    // Refs
    const mediaRecorderRef = useRef(null);
    const recordingStartRef = useRef(null);
    const navigate = useNavigate();

    // Functions
    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        const chunks = [];
        mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorderRef.current.onstop = () => setAudioBlob(new Blob(chunks, { type: 'audio/webm' }));
        mediaRecorderRef.current.start();
        recordingStartRef.current = Date.now();
        setRecordingTime(0);
        setRecording(true);
    }

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
    }

    const handleSubmit = async () => {
        if (!audioBlob) { setError('Please record your speech first.'); return; }
        if (!selectedDifficulty) { setError('Please select a difficulty level.'); return; }

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
            const message = err.response?.data?.detail || 'Failed to submit speech. Please try again.';
            setError(message);
        }
    }

    // useEffect 1 - on mount: fetch difficulties + set random topic
    useEffect(() => {
        API.get("/difficulties")
            .then(response => setDifficulites(response.data))
            .catch(() => setError('Failed to load difficulties. Please refresh the page.'));

        const topics = ["My favourite holiday", "A person who inspires me",
            "Technology in daily life", "A challenge I overcame", "My hometown"];
        setTopic(topics[Math.floor(Math.random() * topics.length)]);
    }, [])

    // useEffect 2 - get ready countdown (5 seconds)
    useEffect(() => {
        if (countdown <= 0) return;
        const count = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(count);
                    setPrepTime(selectedPrepTime);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(count);
    }, [countdown, selectedPrepTime])

    // useEffect 3 - prep time countdown
    useEffect(() => {
        if (preptime <= 0) return;
        const timer = setInterval(() => {
            setPrepTime(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    startRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [preptime])

    // useEffect 4 - recording timer (counts up)
    useEffect(() => {
        if (!recording) return;
        const timer = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [recording])

    // Render - select difficulty
    if (step === 'select') {
        return (
            <div className="select-container">
                <h1>Select your difficulty level</h1>
                <div className="cards-container">
                    {difficulties.map((diff) => (
                        <div className="difficulty-card" key={diff.id} onClick={() => {
                            setSelectedDifficulty(diff.id);
                            setSelectedPrepTime(diff.prep_time);
                            setSelectedDuration(diff.min_duration);
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

    // Render - record
    if (step === 'record') {
        return (
            <div className="topic-page">
                <p className="topic-label">Topic: {topic}</p>

                {countdown > 0 && (
                    <CircularTimer totalTime={5} currentTime={countdown} color="var(--yellow)" />
                )}

                {countdown === 0 && preptime > 0 && (
                    <CircularTimer
                        totalTime={selectedPrepTime}
                        currentTime={preptime}
                        color="var(--pink)"
                        onSkip={() => { setPrepTime(0); startRecording(); }}
                    />
                )}

                {recording && (
                    <div className="recording-section">
                        <CircularTimer
                            totalTime={selectedDuration}
                            currentTime={recordingTime}
                            color="var(--green)"
                        />
                        <button className="stop-btn" onClick={stopRecording}>Stop Recording</button>
                    </div>
                )}

                {audioBlob && (
                    <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                )}

                {error && <p style={{color: 'red'}}>{error}</p>}
            </div>
        )
    }
}

export default Uploads;