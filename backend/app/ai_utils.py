from google import genai
import os
import json
import time



def analyze_speech(file_path, duration, topic):
    GEMINI_API_KEY= os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=GEMINI_API_KEY)

    audio_file = client.files.upload(file=file_path)
    print(f"File state: {audio_file.state}")
    print(f"Full file object: {audio_file}")

    while audio_file.state.name == "PROCESSING":
      time.sleep(3)
      audio_file = client.files.get(name=audio_file.name)
      print(f"New state: {audio_file.state.name}")

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

    Also evaluate:
    - Does the speech have a clear introduction, body, and conclusion?
    - Is the speech coherent and well structured?
    - Include structure feedback in overall_feedback
    """

    response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[audio_file, prompt]
    )
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
