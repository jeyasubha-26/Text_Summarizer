from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

app = FastAPI(title="NLP Summarizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_NAME = "t5-small"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

class TextRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Backend is running successfully"}

@app.post("/summarize")
def summarize_text(request: TextRequest):
    text = request.text.strip()

    if not text:
        return {"summary": "Please enter some text."}

    if len(text.split()) < 20:
        return {"summary": "Please enter at least 20 words for better summarization."}

    formatted_text = "summarize: " + text

    inputs = tokenizer(
        formatted_text,
        return_tensors="pt",
        truncation=True,
        max_length=512
    )

    summary_ids = model.generate(
        inputs["input_ids"],
        max_length=80,
        min_length=20,
        num_beams=4,
        early_stopping=True
    )

    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return {"summary": summary}