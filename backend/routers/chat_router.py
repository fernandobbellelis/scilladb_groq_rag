"""
Router for chat interactions. Orchestrates calls to the chat service.
"""
from sanic.response import json
from sanic import Blueprint, Request, HTTPResponse
from groq import GroqError 

from core.utils import (
    get_groq_chat_response,
    add_turn_to_history,
    get_current_conversation_history,
    reset_conversation_history,
    GroqNotConfiguredError 
)

chat_bp = Blueprint("chat_routes", url_prefix="/chat")

@chat_bp.post("/")
async def handle_chat_message(request: Request) -> HTTPResponse:
    """
    Handles POST requests to /chat/ with a user's message.
    Responds with the LLM's reply by calling the chat service.
    """
    try:
        data = request.json
        user_message = data.get("message")

        if not user_message:
            return json({"error": "Missing 'message' in request body"}, status=400)

        current_history = get_current_conversation_history()
        assistant_reply = get_groq_chat_response(user_message, current_history)

        add_turn_to_history(user_message, assistant_reply)

        return json({"reply": assistant_reply})

    except GroqNotConfiguredError as e:
        print(f"Chat Endpoint Error: {e}")
        return json({"error": str(e)}, status=503) 
    except GroqError as e:

        print(f"Chat Endpoint Groq API Error: {e}")
        return json({"error": f"LLM API error: {str(e)}"}, status=502) 
    except Exception as e:
        print(f"An unexpected error occurred in chat endpoint: {e}")
        return json({"error": "An internal server error occurred."}, status=500)


@chat_bp.get("/history")
async def get_chat_history_endpoint(request: Request) -> HTTPResponse:
    """
    Endpoint to view the current conversation history.
    """
    history = get_current_conversation_history()
    return json({"history": history})


@chat_bp.post("/reset")
async def reset_chat_history_endpoint(request: Request) -> HTTPResponse:
    """
    Resets the conversation history via the chat service.
    """
    reset_conversation_history()
    return json({"status": "Conversation history reset."})