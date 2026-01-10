# ChromaDB (RAG) Setup Guide

## 1. Core Architecture
We are using a **Client-Server** architecture.
-   **Server**: A ChromaDB instance running in a Docker container (standard production setup).
-   **Client**: Our Node.js backend (`chromaClient.js`) connects to this server via HTTP.

> **Why?** The JS client does not support embedded/local-file mode like Python. It requires a running server.

---

## 2. Start the Chroma Server
You MUST run this command in a separate terminal before starting your backend.

### Using Docker (Best)
```bash
docker run -p 8000:8000 chromadb/chroma
```
*This starts Chroma on `localhost:8000`.*

---

## 3. Ingestion Process
Our ingestion script (`src/rag/ingest.js`) runs automatically on server startup.
1.  Loads data from `data/nomaan_dataset.json`.
2.  Generates embeddings locally using `@xenova/transformers` (all-MiniLM-L6-v2).
3.  Sends the embeddings + text to the Chroma Server.

### Manual Ingestion
You can also run the script manually:
```bash
node src/rag/ingest.js
```

---

## 4. Querying
The `retrieveContext` function in `src/rag/retrieve.js`:
1.  Takes the user's question.
2.  Embeds it using the same local model.
3.  Sends the vector to Chroma.
4.  Chroma returns the top N most similar matches.
