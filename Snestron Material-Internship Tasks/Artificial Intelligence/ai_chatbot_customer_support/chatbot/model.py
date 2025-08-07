import json
import random
import nltk
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

nltk.download('punkt', quiet=True)

with open("chatbot/intents.json") as file:
    data = json.load(file)

all_patterns, all_tags = [], []
for intent in data["intents"]:
    for pattern in intent["patterns"]:
        all_patterns.append(pattern)
        all_tags.append(intent["tag"])

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(all_patterns)
model = MultinomialNB()
model.fit(X, all_tags)

def get_response(user_input):
    input_vector = vectorizer.transform([user_input])
    prediction = model.predict(input_vector)[0]
    for intent in data["intents"]:
        if intent["tag"] == prediction:
            return random.choice(intent["responses"])
    return "Sorry, I didn't get that."