import React, { useEffect, useState } from "react";
import "./App.css";
import { Button, FormControl, InputLabel, Input } from "@material-ui/core";
import Message from "./Message";
import db from "./firebase";
import {
  doc,
  onSnapshot,
  collection,
  query,
  serverTimestamp,
} from "firebase/firestore";
// Corrected import statement
import FlipMove from "react-flip-move";
import SendIcon from "@material-ui/icons/Send";
import IconButton from "@material-ui/core/IconButton";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Fetch messages from Firestore on component mount
    const q = query(collection(db, "messages"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({ id: doc.id, message: doc.data() }))
      );
    });

    // Cleanup function to unsubscribe from Firestore listener
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    // Prompt user to enter their name when component mounts
    setUsername(prompt("Please enter your name"));
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    // Add new message to Firestore
    db.collection("messages").add({
      message: input,
      username: username,
      timestamp: serverTimestamp(),
    });

    // Clear input field after sending message
    setInput("");
  };

  return (
    <div className="App">
      <img src="/social.png" alt="messenger logo" width="100" height="100" />

      <h2>Welcome {username}</h2>

      <form className="app__form">
        <FormControl className="app__formControl">
          <Input
            className="app__input"
            placeholder="Enter a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <IconButton
            className="app__iconButton"
            variant="text"
            color="primary"
            disabled={!input}
            onClick={sendMessage}
            type="submit"
          >
            <SendIcon />
          </IconButton>
        </FormControl>
      </form>

      <FlipMove>
        {messages.map(({ id, message }) => (
          <Message key={id} message={message} username={username} />
        ))}
      </FlipMove>
    </div>
  );
}

export default App;
