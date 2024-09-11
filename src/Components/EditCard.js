import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; // useNavigate replaces useHistory in React Router v6
import { readCard, readDeck, updateCard } from "../utils/api/index";

function EditCard() {
    const { deckId, cardId } = useParams();
    const navigate = useNavigate(); // Replacing useHistory with useNavigate
    const initialCardState = {
        id: "",
        front: "",
        back: "",
        deckId: "",
    };
    const initialDeckState = {
        id: "",
        name: "",
        description: "",
    };

    const [card, setCard] = useState(initialCardState); // Corrected initial state for card
    const [deck, setDeck] = useState(initialDeckState); // Corrected initial state for deck

    // Fetch card and deck data on mount or when cardId/deckId changes
    useEffect(() => {
        const abortController = new AbortController();
        async function fetchData() {
            try {
                const cardResponse = await readCard(cardId, abortController.signal);
                const deckResponse = await readDeck(deckId, abortController.signal);
                setCard(cardResponse);
                setDeck(deckResponse);
            } catch (error) {
                console.error("Something went wrong", error);
            }
        }
        fetchData();
        return () => abortController.abort(); // Corrected cleanup function
    }, [cardId, deckId]); // Added cardId and deckId as dependencies

    // Handle form input changes
    function handleChange({ target }) {
        setCard({
            ...card,
            [target.name]: target.value, // Update card state with form input changes
        });
    }

    // Handle form submission
    async function handleSubmit(event) {
        event.preventDefault();
        const abortController = new AbortController();
        try {
            await updateCard({ ...card }, abortController.signal); // Update card via API
            navigate(`/decks/${deckId}`); // Navigate back to deck view
        } catch (error) {
            console.error("Error updating card:", error);
        }
    }

    // Handle cancel button
    function handleCancel() {
        navigate(`/decks/${deckId}`); // Navigate back to the deck view without saving
    }

    return (
        <div>
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                    <Link to={`/decks/${deckId}`}>{deck.name}</Link>
                </li>
                <li className="breadcrumb-item active">Edit Card {cardId}</li>
            </ol>
            <form onSubmit={handleSubmit}>
                <h2>Edit Card</h2>
                <div className="form-group">
                    <label>Front</label>
                    <textarea
                        id="front"
                        name="front"
                        className="form-control"
                        onChange={handleChange}
                        value={card.front || ""} // Ensure controlled input
                    />
                </div>
                <div className="form-group">
                    <label>Back</label>
                    <textarea
                        id="back"
                        name="back"
                        className="form-control"
                        onChange={handleChange}
                        value={card.back || ""} // Ensure controlled input
                    />
                </div>
                <button
                    type="button" // Ensure this button doesn't trigger form submission
                    className="btn btn-secondary mx-1"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
                <button className="btn btn-primary mx-1" type="submit">
                    Save
                </button>
            </form>
        </div>
    );
}

export default EditCard;
