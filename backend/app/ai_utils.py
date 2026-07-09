import google.generativeai as genai 
import os
import json



def analyze_speech(file_path, duration, topic):
    GEMINI_API_KEY= os.getenv("GEMINI_API_KEY")
    genai.configure(api_key= GEMINI_API_KEY)

    model = genai.GenerativeModel("gemini-1.5-flash")

    audio_file= genai.upload_file(file_path)

    prompt = f""" 
    You are a speech coach. Listen to this audio and respond ONLY in JSON format with no extra text, no markdown, no backticks.
    Return exactly this structure:
    {{
    "transcript": "full transcribed text here",
    "filler_words_count": 0,
    "filler_words_list": [],
    "transcript_highlighted": "transcript with filler words wrapped in **double asterisks**",
    "relevance_score": 0,
    "tone_consistency_score": 0,
    "overall_feedback": "detailed feedback here"
    }}
    The user's speech topic is: {topic}
    Use this to score relevance_score.
    Filler words include: um, uh, like, you know, so, basically, literally, right, okay.
    Scores should be between 1 and 10.
    """

    response= model.generate_content([audio_file, prompt])
    response_text= response.text

    result= json.loads(response_text)

    words_count= len(result["transcript"].split())
    pace_wpm= round(words_count/(duration/60))

    return{
        "transcript": result["transcript"],
        "filler_words_count": result["filler_words_count"],
        "filler_words_list": result["filler_words_list"],
        "transcript_highlighted": result["transcript_highlighted"],
        "relevance_score": result["relevance_score"],
        "tone_consistency_score": result["tone_consistency_score"],
        "overall_feedback": result["overall_feedback"],
        "pace_wpm": pace_wpm
    }
