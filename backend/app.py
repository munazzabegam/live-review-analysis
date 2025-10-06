from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)
CORS(app)

@app.route("/analyze_url", methods=["POST"])
def analyze_url():
    data = request.json
    url = data.get("url", "")
    if not url or "flipkart.com" not in url:
        return jsonify({"error": "Please provide a valid Flipkart product URL"}), 400

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")

        # Extract reviews (Flipkart uses class "_6K-7Co" for reviews)
        reviews = [r.text.strip() for r in soup.find_all("div", {"class": "ZmyHeo"})]
        if not reviews:
            return jsonify({"error": "No reviews found"}), 404

        sentiments = {"positive": 0, "neutral": 0, "negative": 0}
        total_polarity = 0
        analyzed_reviews = []

        for review in reviews:
            polarity = TextBlob(review).sentiment.polarity
            total_polarity += polarity
            if polarity > 0:
                sentiments["positive"] += 1
                label = "Positive"
            elif polarity < 0:
                sentiments["negative"] += 1
                label = "Negative"
            else:
                sentiments["neutral"] += 1
                label = "Neutral"
            analyzed_reviews.append({"review": review, "polarity": polarity, "sentiment": label})

        avg_polarity = total_polarity / len(reviews)
        result = {
            "total_reviews": len(reviews),
            "average_polarity": avg_polarity,
            "summary": sentiments,
            "reviews": analyzed_reviews
        }
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
