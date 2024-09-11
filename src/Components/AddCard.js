import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createCard, readDeck } from "../utils/api/index";

function AddCard() {
    const { deckId } = useParams();
    const navigate = useNavigate(); // Replace useHistory with useNavigate
    const initialState = {
        front: "",
        back: "",
    };

    const [newCard, setNewCard] = useState(initialState);
    const [deck, setDeck] = useState({});

    useEffect(() => {
        const abortController = new AbortController();
        async function fetchData() {
            try {
                const response = await readDeck(deckId, abortController.signal);
                setDeck(response);
            } catch (error) {
                console.error("Something went wrong", error);
            }
        }
        fetchData();
        return () => abortController.abort();
    }, [deckId]);

    function handleChange({ target }) {
        setNewCard({
            ...newCard,
            [target.name]: target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const abortController = new AbortController();
        try {
            await createCard(deckId, { ...newCard }, abortController.signal);
            navigate(0); // Replace history.go(0) with navigate(0)
            setNewCard(initialState);
        } catch (error) {
            console.error("Error creating card:", error);
        }
    }

    function handleDone() {
        navigate(`/decks/${deckId}`); // Replace history.push with navigate
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
                <li className="breadcrumb-item active">Add Card</li>
            </ol>
            <form onSubmit={handleSubmit}>
                <h2>{deck.name}: Add Card</h2>
                <div className="form-group">
                    <label>Front</label>
                    <textarea
                        id="front"
                        name="front"
                        className="form-control"
                        onChange={handleChange}
                        value={newCard.front}
                    />
                </div>
                <div className="form-group">
                    <label>Back</label>
                    <textarea
                        id="back"
                        name="back"
                        className="form-control"
                        onChange={handleChange}
                        value={newCard.back}
                    />
                </div>
                <button
                    className="btn btn-secondary mx-1"
                    type="button"
                    onClick={handleDone}
                >
                    Done
                </button>
                <button className="btn btn-primary mx-1" type="submit">
                    Save
                </button>
            </form>
        </div>
    );
}

export default AddCard;

