from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI


# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Allow cross-origin calls (JS can call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM outside of function (only once)
llm = ChatOpenAI()
# llm = ChatGoogleGenerativeAI(
#     model="gemini-1.5-pro",
#     temperature=0,
#     max_tokens=None,
#     timeout=None,
#     max_retries=2,
# )

# Prompt Template (only once)
prompt_template = PromptTemplate.from_template(""" 
Generate a simple arithmetic question suitable for a casual math game.

Difficulty: {difficulty}

Requirements:
- The question should be a basic arithmetic expression (like addition, subtraction, multiplication, or division) and it has to be random every time.
- Only one correct answer.
- Three incorrect but believable options.
- The answer and options should be integers only.
- Don't explain anything, just return in the format:

{{
  "question": "7 + 5 = ?",
  "correct_answer": "12",
  "options": ["12", "10", "13", "15"]
}}
""")

@app.get("/question")
def get_question(difficulty: str = "medium"):
    # Create the prompt dynamically
    prompt = prompt_template.invoke({"difficulty": difficulty})

    # Get response from LLM
    res = llm.invoke(prompt)
    question = res.content

    # Remove extra backticks and cleanup if needed
    if question.startswith('`'):
        new_line_index = question.find('\n')
        question = question[new_line_index+1:]
    if question.endswith('`'):
        question = question[:-3]    
     
    # Convert to dictionary
    op_dict = json.loads(question)
    question=None
    return op_dict
