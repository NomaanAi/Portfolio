# Viva & Interview Preparation Guide

**Role:** BCA Student & Full Stack Developer
**Project:** Personal Portfolio & Chatbot

---

## Part 1: Portfolio Questions (Technical & General)

**Q1: Why did you choose Next.js over plain HTML/css?**
> **Answer**: Next.js provides reusable components (React), better performance (Server Side Rendering), and easy page routing. It makes the site faster and easier to manage than writing hundreds of lines of duplicate HTML.

**Q2: How do you make the site responsive?**
> **Answer**: I used Tailwind CSS classes like `md:flex-row` and `lg:w-1/2`. Tailwind allows me to style elements for mobile first and then add breakpoints for larger screens.

**Q3: What database are you using and why?**
> **Answer**: I use MongoDB (Atlas). It is a NoSQL database which is flexible and works perfectly with JavaScript (JSON data). It’s ideal for storing things like project details and contact form messages.

**Q4: How does the Contact Form work?**
> **Answer**: The frontend (React) sends a POST request with the form data to my Express.js backend. The backend validates the data and saves it to the MongoDB database.

**Q5: What is "Framer Motion" used for?**
> **Answer**: It’s a library for React animations. I used it to make the sections fade in smoothly when you scroll, giving the site a professional feel without writing complex CSS keyframes.

**Q6: Did you copy this template?**
> **Answer**: I used a reference for the design structure but wrote the code myself. I customized the components, colors, and added my own backend integration.

**Q7: How do you handle deployment?**
> **Answer**: The frontend is deployed on Vercel (optimized for Next.js) and the backend is on Render/Heroku. They communicate via API endpoints.

**Q8: What is strict mode in React?**
> **Answer**: It’s a development tool that highlights potential problems. It runs effects twice to check for bugs, which is why we sometimes see double console logs in dev mode.

**Q9: Explain the folder structure.**
> **Answer**: `client` contains the Next.js frontend. `server` contains the Express API. `src` holds my components and pages. This separation concerns ensures the frontend code doesn't mix with backend logic.

**Q10: What was the hardest part?**
> **Answer**: Connecting the backend to the frontend and handling CORS (Cross-Origin Resource Sharing) errors, and also implementing the AI chatbot to answer correctly.

---

## Part 2: AI Chatbot Questions

**Q1: How does your chatbot work?**
> **Answer**: It sends the user's message to the OpenRouter API (which connects to models like Llama or GPT). I send a "System Prompt" along with the message that tells the AI to act as "Nomaan" and only answer portfolio-related questions.

**Q2: Did you build the AI model?**
> **Answer**: No, I am using a pre-trained Large Language Model (LLM) via an API. Building a model from scratch requires massive data and compute power. I am focusing on the *application* of AI.

**Q3: How do you stop it from answering random questions?**
> **Answer**: In the System Prompt, I added strict instructions: "If the question is not about my portfolio, politely decline to answer."

**Q4: Is this chatbot expensive?**
> **Answer**: I use OpenRouter which offers free or very cheap models (like Llama 3 8B). For a student portfolio, the cost is negligible.

**Q5: What is "System Prompt"?**
> **Answer**: It’s the invisible first instruction given to the AI before the conversation starts. It sets the rules, personality, and boundaries for the bot.

---

## Part 3: ML Project Questions (Future Prep)

**Q1: What is the difference between Supervised/Unsupervised learning?**
> **Answer**: Supervised has labeled data (Teaching with answers, like "This is a cat"). Unsupervised has no labels (The computer finds patterns on its own).

**Q2: Which library do you use for ML?**
> **Answer**: Python and libraries like Scikit-Learn (for algorithms) and Pandas (for data handling).

**Q3: What is "Training" a model?**
> **Answer**: It’s the process of feeding data to an algorithm so it can minimize errors and learn the relationship between input and output.

**Q4: What is a Regression problem?**
> **Answer**: Predicting a continuous number (like Price, Age, Temperature).

**Q5: What is a Classification problem?**
> **Answer**: Predicting a category (like Spam/Not Spam, Cat/Dog).
