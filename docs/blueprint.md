# **App Name**: KGPT Chat

## Core Features:

- Message Display: Display user and KGPT messages in a chat interface, with rounded message bubbles styled according to the sender.
- Auto-Scroll: Implement an auto-scroll feature to keep the newest message in view.
- Input Area: Create a footer input area for users to type and send messages.
- Loading State: Show a loading indicator while awaiting API responses from KGPT.
- In-Memory Message Storage: Maintain an in-memory array of messages and re-render the component on new entries.
- Error Handling: Implement error handling to display an error message in the chat if the API request fails.
- API Communication: Send the user's question to the KGPT API and parse the JSON response to render the AI's answer in a new chat bubble.

## Style Guidelines:

- Primary color: HSL(210, 54%, 44%) which is RGB(#3584E4) for user message bubbles.
- Background color: HSL(210, 15%, 95%) which is RGB(#F0F4F8) for a light background that ensures readability and supports a clean interface.
- Accent color: HSL(180, 48%, 40%) which is RGB(#34A7A7) for interactive elements.
- Body and headline font: 'Inter' (sans-serif) for clear readability in both messages and UI elements.
- Use simple, outline-style icons for the send button and any other interactive elements.
- Employ a clean and modern layout with rounded message bubbles, mirroring the design of modern chat interfaces such as Claude. Balance space between elements to make for easy reading.
- Subtle fade-in animations for new messages.