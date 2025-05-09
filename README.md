# ScillaDB_Groq_RAG: A High-Performance RAG Chatbot Solution

## Project Overview

This project is dedicated to addressing and overcoming the challenges I faced with a specific client who complained about the response time of a Retrieval-Augmented Generation (RAG) chatbot one year ago. At that time, I was at a loss on how to optimize the RAG chatbot for faster response times. However, with advancements in technology and newfound knowledge, I am now equipped to tackle the root cause of those issues.

This project is a culmination of my determination to solve the problem by leveraging modern technologies. It currently focuses on the high-performance API backend using Sanic and Groq for fast LLM interactions, with plans to integrate embeddings (e.g., from a model like "ModernBert") and a vector database like ScyllaDB for the full RAG capabilities.

## Key Components (Current & Planned)

1.  **RAG Chatbot Core (API)**: A chatbot API that currently provides direct interaction with an LLM, designed for low-latency responses.
    *   *(Planned: Integration of retrieval mechanisms for full RAG functionality).*
2.  **Sanic as the API framework**: Uses Sanic for its asynchronous capabilities, aiming for best-in-class response times among Python frameworks for the API layer.
3.  **Groq as LLM Provider**: Employs Groq for its fast language model inference, enhancing the chatbot's generative capabilities.
4.  **(Planned) Embeddings Model**:
    *   *(e.g., ModernBert or other suitable sentence transformer models will be used to generate high-quality embeddings for input text and document chunks).*
5.  **(Planned) ScyllaDB for Vector Storage and Retrieval**:
    *   *(To efficiently store and retrieve embeddings using ScyllaDB, ensuring low-latency access for the retrieval part of RAG).*

## Current Features (API Backend)

-   **High-Performance API**: Optimized for fast LLM response times via Sanic and Groq.
-   **Scalable Foundation**: Built with a clean directory structure to easily expand features.
-   **Basic Chat Functionality**:
    -   Send messages to the Groq LLM.
    -   View conversation history (in-memory for the current session).
    -   Reset conversation history.

## Getting Started

### Prerequisites

-   Python 3.8+ (Python 3.13.1 used in development)
-   `pip` (Python package installer)
-   A Groq API Key (from [GroqCloud Console](https://console.groq.com/))

### Setup and Run

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <your-repository-url>
    cd scilladb_groq_rag
    ```

2.  **Navigate to the backend directory:**
    The Sanic application code resides in the `backend` subdirectory.
    ```bash
    cd backend
    ```

3.  **Create and activate a virtual environment:**
    It's highly recommended to use a virtual environment to manage project dependencies.
    ```bash
    python -m venv env
    source env/bin/activate
    ```
    (On Windows, use: `env\Scripts\activate`)

4.  **Install dependencies:**
    The required Python packages are listed in `requirements.txt`.
    ```bash
    pip install -r requirements.txt
    ```

5.  **Configure Groq API Key:**
    Create a `.env` file in the `backend` directory:
    ```bash
    touch .env
    ```
    Add your Groq API key to this `.env` file:
    ```
    GROQ_API_KEY="YOUR_ACTUAL_GROQ_API_KEY_HERE"
    ```
    Replace `"YOUR_ACTUAL_GROQ_API_KEY_HERE"` with your real key.
    *Alternatively, you can set the `GROQ_API_KEY` as an environment variable in your shell before running the application.*

6.  **Run the Sanic application:**
    From the `backend` directory (with the virtual environment activated):
    ```bash
    python main.py
    ```
    You should see output similar to:
    ```
    Main  17:48:40 INFO:
      ┌──────────────────────────────────────────────────────────────────────────┐
      │                              Sanic v25.3.0                               │
      │                     Goin' Fast @ http://0.0.0.0:8000                     │
      ├───────────────────────┬──────────────────────────────────────────────────┤
      │                       │         app: MyRefactoredAppWithChat             │
      │     ▄███ █████ ██     │        mode: debug, single worker                │
      │    ██                 │      server: sanic, HTTP/1.1                     │
      │     ▀███████ ███▄     │      python: 3.13.1                              │
      │                 ██    │    platform: macOS-14.7.4-arm64-arm-64bit-Mach-O │
      │    ████ ████████▀     │ auto-reload: enabled                             │
      │                       │    packages: sanic-routing==23.12.0              │
      │ Build Fast. Run Fast. │                                                  │
      └───────────────────────┴──────────────────────────────────────────────────┘
    ```
    The server is now running and accessible at `http://localhost:8000`.

### Interacting with the Chatbot API

You can interact with the API using tools like `curl` or Postman.

**Example using `curl`:**

1.  **Send a chat message (POST request):**
    ```bash
    curl -X POST \
         -H "Content-Type: application/json" \
         -d '{"message": "Hello! Who are you?"}' \
         http://localhost:8000/chat/
    ```
    *Response:*
    ```json
    {"reply": "I am a helpful and concise chatbot."}
    ```

2.  **Get chat history (GET request):**
    ```bash
    curl http://localhost:8000/chat/history
    ```

3.  **Reset chat history (POST request):**
    ```bash
    curl -X POST http://localhost:8000/chat/reset
    ```

