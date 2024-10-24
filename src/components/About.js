import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function About() {
    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h1 className="display-4">About Wordsworth</h1>
                <p className="lead">
                    Your ultimate flashcard application designed to enhance your learning experience and help you master new information effectively.
                </p>
            </div>

            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <h2 className="mb-4">Key Features</h2>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <strong>Create Flashcard Sets:</strong> Easily organize your study materials by creating custom sets for each subject or topic.
                        </li>
                        <li className="list-group-item">
                            <strong>Add Flashcards:</strong> Add terms and definitions to each set. You can create as many flashcards as needed for comprehensive coverage.
                        </li>
                        <li className="list-group-item">
                            <strong>Edit Flashcards:</strong> Make quick updates by double-clicking on any flashcard to edit its content instantly.
                        </li>
                        <li className="list-group-item">
                            <strong>Delete Flashcards:</strong> Keep your flashcard sets tidy by removing any unwanted flashcards with a single click.
                        </li>
                        <li className="list-group-item">
                            <strong>Study Mode (Grok):</strong> Focus on mastering difficult terms as flashcards appear one at a time, allowing for concentrated study.
                        </li>
                        <li className="list-group-item">
                            <strong>Delete All Flashcard Sets:</strong> Want a fresh start? Easily delete all your flashcard sets from the settings page with a simple confirmation.
                        </li>
                        <li className="list-group-item">
                            <strong>Feedback Animations:</strong> Enjoy smooth animations that provide visual feedback as you study, enhancing the learning experience without being distracting.
                        </li>
                        <li className="list-group-item">
                            <strong>Code Snippet Functionality:</strong> Perfect for tech enthusiasts, you can include code snippets in your flashcards to aid in programming language studies. Format your snippets like this:
                            <pre className="bg-light p-2 mt-2 rounded">
                                <code>
                                    ```{`{programming language}`}<br />
                                    // Your code goes here<br />
                                    ```
                                </code>
                            </pre>
                            Use this syntax to study languages like Python, Java, and HTML. Your code will be syntax-highlighted in study mode, making technical learning much more efficient.
                        </li>
                    </ul>

                    <h2 className="mt-5">Why "Wordsworth"?</h2>
                    <p>
                        Wordsworth was created to combine my passion for software development with my need for effective study tools. This project serves as both a personal learning experience in modern web technologies and a practical application that I use for studying in college.
                    </p>

                    <div className="text-center mt-5">
                        <a href="/" className="btn btn-primary btn-lg">Get Started with Wordsworth</a>
                    </div>

                    <br></br>
                </div>
            </div>
        </div>
    );
}

export default About;
