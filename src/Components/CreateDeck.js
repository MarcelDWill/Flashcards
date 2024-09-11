import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate replaces useHistory
import { createDeck } from "../utils/api/index";

function CreateDeck() {
    const navigate = useNavigate(); // Replacing useHistory with useNavigate
    const initialState = {
        name: "",
        description: "",
    };
    const [newDeck, setNewDeck] = useState(initialState);

    // Handle input change
    function handleChange({ target }) {
        setNewDeck({
            ...newDeck,
            [target.name]: target.value,
        });
    }

    // Handle form submission
    async function handleSubmit(event) {
        event.preventDefault();
        const abortController = new AbortController();
        try {
            const response = await createDeck({ ...newDeck }, abortController.signal);
            navigate(`/decks/${response.id}`); // Navigate to the created deck
        } catch (error) {
            console.error("Error creating deck:", error);
        }
    }

    // Handle cancel action
    function handleCancel() {
        navigate("/"); // Navigate to the home page without saving
    }

    return (
        <div>
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">Create Deck</li>
            </ol>
            <form onSubmit={handleSubmit}>
                <h1>Create Deck</h1>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        id="name"
                        name="name"
                        className="form-control"
                        onChange={handleChange}
                        type="text"
                        value={newDeck.name}
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        onChange={handleChange}
                        value={newDeck.description}
                    />
                </div>
                <button
                    type="button" // Ensure this button doesn't submit the form
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

export default CreateDeck;
