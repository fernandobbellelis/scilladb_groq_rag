"""
Core utility functions, including chat service logic for Groq.
"""
import os
from typing import List, Dict, Tuple, Optional
from groq import Groq, GroqError

GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-8b-8192") 

groq_api_key = os.environ.get("GROQ_API_KEY")
groq_client: Optional[Groq] = None
if groq_api_key:
    groq_client = Groq(api_key=groq_api_key)
else:
    print("ERROR: core.utils - GROQ_API_KEY environment variable not set. Chat functionality will be disabled.")

_system_prompt = {"role": "system", "content": "You are a helpful and concise chatbot."}
_conversation_history: List[Dict[str, str]] = [_system_prompt]
_MAX_HISTORY_ITEMS = 21 


class ChatServiceError(Exception):
    """Custom exception for chat service errors."""
    pass

class GroqNotConfiguredError(ChatServiceError):
    """Exception raised when Groq client is not configured."""
    pass


def get_groq_chat_response(user_message: str, current_history: List[Dict[str, str]]) -> str:
    """
    Gets a chat completion from Groq.

    Args:
        user_message: The user's current message.
        current_history: The conversation history to provide as context.

    Returns:
        The assistant's response.

    Raises:
        GroqNotConfiguredError: If the Groq client is not initialized.
        GroqError: If there's an API error from Groq.
    """
    if not groq_client:
        raise GroqNotConfiguredError("Groq client is not configured due to missing API key.")

    messages_for_api = current_history + [{"role": "user", "content": user_message}]

    try:
        chat_completion = groq_client.chat.completions.create(
            messages=messages_for_api,
            model=GROQ_MODEL,
            temperature=0.7,
            max_tokens=1024,
        )
        assistant_response = chat_completion.choices[0].message.content
        if assistant_response is None: 
            raise GroqError("Groq API returned an empty response content.")
        return assistant_response
    except GroqError as e:
        print(f"Groq API Error in core.utils: {e}")
        raise 


def add_turn_to_history(user_message: str, assistant_message: str):
    """Adds a user-assistant turn to the global conversation history and manages its size."""
    global _conversation_history
    _conversation_history.append({"role": "user", "content": user_message})
    _conversation_history.append({"role": "assistant", "content": assistant_message})

    if len(_conversation_history) > _MAX_HISTORY_ITEMS:
        _conversation_history[:] = [_conversation_history[0]] + _conversation_history[-_MAX_HISTORY_ITEMS+1:]


def get_current_conversation_history() -> List[Dict[str, str]]:
    """Returns a copy of the current conversation history."""
    return list(_conversation_history) 


def reset_conversation_history():
    """Resets the conversation history to the initial system prompt."""
    global _conversation_history
    _conversation_history[:] = [_system_prompt]
    print("Conversation history reset in core.utils")

