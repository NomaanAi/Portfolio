# RAG Integration Documentation

## Overview
This project now includes Retrieval-Augmented Generation (RAG) using ChromaDB and OpenRouter.

## 🚀 Prerequisite: Start ChromaDB
The backend requires a local ChromaDB server running on port `8000`.

### Option 1: Using Docker (Recommended)
```bash
docker run -p 8000:8000 chromadb/chroma
```

### Option 2: Using Python (Local)
If you have Python installed:
```bash
pip install chromadb
chroma run --path ./chroma_db
```
*Run this command in the `server/` directory.*

## 📂 Architecture & Design

### 1. MongoDB vs ChromaDB
-   **MongoDB** (Application DB): Stores structured data—User profiles, Chat Logs, Project details, Settings. It is the "Source of Truth" for the application state.
-   **ChromaDB** (Vector DB): Stores **unstructured semantic data** (embeddings). It is used purely for "Similarity Search"—finding text that means the same thing as the user's question, even if keywords don't match exactly.

### 2. Preventing Hallucinations
-   **Grounding**: The LLM is instructed to answer **ONLY** using the retrieved context.
-   **Separation**: By feeding the model specific facts from ChromaDB, we restrict its creative freedom to the facts provided, effectively turning it from a "Creative Writer" into a "Factual Summarizer".

### 3. Interview Explanation
*"In this project, I implemented a decoupled RAG architecture. I maintained MongoDB for operational data (logs, users) but integrated ChromaDB for semantic search. On server startup, I ingest critical knowledge into ChromaDB using local embeddings (Xenova). When a user asks a question, I first query the vector database for relevant context, then construct a strict prompt for the LLM. This ensures the chatbot remains factual and hallucinates less, mirroring how enterprise-grade search systems work."*

## 🛠️ Files Added
-   `src/rag/chromaClient.js`: Database connection.
-   `src/rag/embedder.js`: Local embedding model (MiniLM).
-   `src/rag/ingest.js`: Ingestion script (runs on startup).
-   `src/rag/retrieve.js`: Context retrieval logic.
-   `src/rag/prompt.js`: Prompt construction.
-   `data/nomaan_dataset.json`: Knowledge base.
