# sentiment.py
# This module provides functionality to analyze the sentiment of a given title using the VADER sentiment analysis tool.
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

# This module provides functionality to analyze the sentiment of a title
def analyze_sentiment(title: str) -> str:
    score = analyzer.polarity_scores(title)["compound"]
    if score >= 0.05:
        return "positive"
    elif score <= -0.05:
        return "negative"
    else:
        return "neutral"