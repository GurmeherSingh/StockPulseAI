from fastapi import FastAPI, Query
from typing import List, Dict
import requests
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from .services import analyze_sentiment

app = FastAPI(title="Stock Pulse API")
load_dotenv()
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
app = FastAPI()
analyzer = SentimentIntensityAnalyzer()
