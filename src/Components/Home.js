import React, { useState, useEffect } from "react";
import { listDecks, deleteDeck } from "../utils/api/index";
import { Link, useNavigate } from "react-router-dom"; // useNavigate replaces useHistory

function Home() {
    const navigate = useNavigate(); // Replaced useHistory with useNavigate
    const [decks, setDecks] = useState([]);

    useEffect(() => {
        const abortController = new AbortController();
        async function fetchData() {
            try {
                const deckResponse = await listDecks(abortController.signal);
                setDecks(deckResponse);
            } catch (error) {
                console.error("Something went wrong", error);
            }
        }
        fetchData();
        return () => {
            abortController.abort(); // Cleanup function
        };
    }, []);

    async function handleDelete(deck) {
        if (window.confirm(`Delete this deck? You will not be able to recover it.`)) {
            try {
                await deleteDeck(deck.id);
                setDecks((currentDecks) => currentDecks.filter((d) => d.id !== deck.id)); // Remove the deck from the state
            } catch (error) {
                console.error("Failed to delete deck:", error);
            }
        }
    }

    return (
        <div className="container">
            <Link className="btn btn-secondary mb-2" to="/decks/new">
                Create Deck
            </Link>
            <div className="card-deck">
                {decks.map((deck) => (
                    <div className="card" style={{ width: "30rem" }} key={deck.id}>
                        <div className="card-body">
                            <div className="card-title">{deck.name}</div>
                            <div className="card-subtitle mb-2 text-muted">
                                {deck.cards.length} cards
                            </div>
                            <div className="card-text">{deck.description}</div>
                            <Link className="btn btn-secondary mx-1" to={`/decks/${deck.id}`}>
                                View
                            </Link>
                            <Link className="btn btn-primary mx-1" to={`/decks/${deck.id}/study`}>
                                Study
                            </Link>
                            <button
                                type="button"
                                className="btn btn-danger mx-1"
                                onClick={() => handleDelete(deck)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
