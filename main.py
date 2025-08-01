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

# Endpoint to get stock data for the last 7 days
@app.get("/stocks/data")
def get_stock_data(symbol: str = Query(...)):
    url = "https://www.alphavantage.co/query"
    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": symbol,
        "apikey": ALPHA_VANTAGE_API_KEY,
        "outputsize": "compact"
    }
    response = requests.get(url, params=params).json()

    if "Time Series (Daily)" in response:
        time_series = response["Time Series (Daily)"]
        today = datetime.utcnow().date()
        last_week = today - timedelta(days=7)

        filtered_prices = []
        for date_str in sorted(time_series.keys(), reverse=True):
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
            if date_obj >= last_week:
                daily_data = time_series[date_str]
                filtered_prices.append({
                    "date": date_str,
                    "open": float(daily_data["1. open"]),
                    "high": float(daily_data["2. high"]),
                    "low": float(daily_data["3. low"]),
                    "close": float(daily_data["4. close"]),
                    "volume": int(daily_data["5. volume"])
                })

        return {
            "symbol": symbol,
            "prices": filtered_prices
        }

    return {"error": response.get("Error Message", "Unknown error") or response}