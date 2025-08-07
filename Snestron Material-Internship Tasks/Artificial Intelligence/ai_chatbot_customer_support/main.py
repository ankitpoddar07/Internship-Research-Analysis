import streamlit as st
from chatbot.model import get_response

st.set_page_config(page_title="AI Chatbot", page_icon="🤖", layout="centered")
st.markdown("""
    <style>
    .stTextInput > div > div > input {
        padding: 10px;
        font-size: 16px;
    }
    .bot-msg {
        background-color: #e6f0ff;
        padding: 12px;
        border-radius: 10px;
        margin-bottom: 8px;
    }
    .user-msg {
        background-color: #fff3cd;
        padding: 12px;
        border-radius: 10px;
        margin-bottom: 8px;
    }
    </style>
""", unsafe_allow_html=True)

st.markdown("<h1 style='text-align:center;'>🤖 AI Customer Support Bot</h1>", unsafe_allow_html=True)
st.markdown("Ask me anything, and I’ll try to help!")

# Chat history
if "history" not in st.session_state:
    st.session_state.history = []

# Chat input
with st.form(key="chat_form"):
    user_input = st.text_input("You:", placeholder="Type your message here...", label_visibility="collapsed")
    submit_button = st.form_submit_button("Send")

if submit_button and user_input:
    bot_response = get_response(user_input)
    st.session_state.history.append(("user", user_input))
    st.session_state.history.append(("bot", bot_response))

# Display history
for sender, message in st.session_state.history:
    if sender == "user":
        st.markdown(f"<div class='user-msg'><strong>You:</strong> {message}</div>", unsafe_allow_html=True)
    else:
        st.markdown(f"<div class='bot-msg'><strong>Bot:</strong> {message}</div>", unsafe_allow_html=True)
