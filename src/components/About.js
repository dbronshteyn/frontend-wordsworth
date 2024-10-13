import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function About() {
    return (
        <div className="container mt-5">
            <h1>About Wordsworth</h1>
            <p>Welcome to Wordsworth, your ultimate flashcard application designed to help you learn and retain information efficiently.</p>

            <h2>How to Use Wordsworth</h2>
            <ul>
                <li><strong>Create Flashcard Sets:</strong> Start by creating a new flashcard set. Give it a name and description to organize your study material.</li>
                <li><strong>Add Flashcards:</strong> Within each set, you can add individual flashcards. Each flashcard consists of a term and its definition.</li>
                <li><strong>Edit Flashcards:</strong> Double-click on any flashcard to edit its term or definition.</li>
                <li><strong>Delete Flashcards:</strong> Click the "X" button on any flashcard to delete it.</li>
                <li><strong>Dark Mode:</strong> Toggle dark mode in the settings to reduce eye strain during night-time study sessions.</li>
                <li><strong>Delete All Flashcard Sets:</strong> Use the settings page to delete all flashcard sets if you need to start fresh.</li>
            </ul>

            <h2>Why Wordsworth?</h2>
            <p>The name "Wordsworth" was inspired by the famous poet William Wordsworth, as I wanted a scholarly and literary reference to reflect the app's educational purpose. As an avid reader, I found this name fitting for a tool designed to help expand vocabulary and knowledge.</p>
        </div>
    );
}

export default About;