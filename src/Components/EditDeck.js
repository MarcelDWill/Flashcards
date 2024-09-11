import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; // useNavigate replaces useHistory in React Router v6
import { readDeck, updateDeck } from "../utils/api/index";

function EditDeck() {
    const { deckId } = useParams();
    const navigate = useNavigate(); // Replacing useHistory with useNavigate
    const initialDeckState = {
        id: "",
        name: "",
        description: "",
    };
    const [deck, setDeck] = useState(initialDeckState);

    // Fetch the deck data when the component is mounted or when deckId changes
    useEffect(() => {
        const abortController = new AbortController();
        async function fetchData() {
            try {
                const response = await readDeck(deckId, abortController.signal);
                setDeck(response); // Update the deck state with fetched data
            } catch (error) {
                console.error("Something went wrong", error);
            }
        }
        fetchData();
        return () => abortController.abort(); // Corrected the return of the cleanup function
    }, [deckId]); // Added deckId as a dependency to run the effect when it changes

    // Handle form input changes
    function handleChange({ target }) {
        setDeck({
            ...deck,
            [target.name]: target.value, // Update deck state with form input changes
        });
    }

    // Handle form submission
    async function handleSubmit(event) {
        event.preventDefault();
        const abortController = new AbortController();
        try {
            await updateDeck({ ...deck }, abortController.signal); // Update the deck via API
            navigate(`/decks/${deckId}`); // Navigate back to the deck view
        } catch (error) {
            console.error("Error updating deck:", error);
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
                <li className="breadcrumb-item active">Edit Deck</li>
            </ol>
            <form onSubmit={handleSubmit}>
                <h1>Edit Deck</h1>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        id="name"
                        name="name"
                        className="form-control"
                        onChange={handleChange}
                        type="text"
                        value={deck.name || ""}
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        onChange={handleChange}
                        value={deck.description || ""}
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-secondary mx-1"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
                <button className="btn btn-primary mx-1" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default EditDeck;
