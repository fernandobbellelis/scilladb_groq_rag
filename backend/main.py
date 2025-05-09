"""
Main application file to initialize and run the Sanic server.
"""
import os
from sanic import Sanic
from dotenv import load_dotenv 

load_dotenv() 

from routers.hello_router import hello_bp
from routers.chat_router import chat_bp

app = Sanic("MyRefactoredAppWithChat")

app.blueprint(hello_bp)
app.blueprint(chat_bp)

if __name__ == "__main__":

    if not os.environ.get("GROQ_API_KEY"):
        print("WARNING (main.py): GROQ_API_KEY environment variable is not set. "
              "Chat functionality will be disabled as per core.utils.")

    app.run(host="0.0.0.0", port=8000, debug=True, auto_reload=True)