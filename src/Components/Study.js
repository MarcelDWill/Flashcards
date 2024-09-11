import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; // Updated for React Router v6
import { readDeck } from "../utils/api/index";

function Study() {
    const { deckId } = useParams();
    const [deck, setDeck] = useState({});
    const [cards, setCards] = useState([]);
    const [cardNumber, setCardNumber] = useState(1);
    const [front, setFront] = useState(true); // Renamed for clarity
    const navigate = useNavigate(); // Replaced useHistory with useNavigate

    // Fetch deck and cards
    useEffect(() => {
        const abortController = new AbortController();
        async function fetchData() {
            try {
                const response = await readDeck(deckId, abortController.signal);
                setDeck(response);
                setCards(response.cards);
            } catch (error) {
                console.error("Error fetching deck:", error);
            }
        }
        fetchData();
        return () => abortController.abort(); // Corrected the return of cleanup function
    }, [deckId]); // Added deckId as dependency

    // Handle moving to the next card
    function nextCard() {
        if (cardNumber < cards.length) {
            setCardNumber(cardNumber + 1); // Increment card number
            setFront(true); // Reset to front side
        } else {
            if (window.confirm(`Restart cards? Click 'Cancel' to return to the home page.`)) {
                setCardNumber(1);
                setFront(true); // Reset to front side
            } else {
                navigate("/"); // Navigate to home page
            }
        }
    }

    // Handle flipping the card
    function flipCard() {
        setFront(!front); // Toggle front/back
    }

    // Render the next button if the back of the card is showing
    function showNextButton() {
        if (!front) {
            return (
                <button onClick={nextCard} className="btn btn-primary mx-1">
                    Next
                </button>
            );
        }
        return null;
    }

    // Check if enough cards are available for studying
    function enoughCards() {
        const currentCard = cards[cardNumber - 1]; // Get current card based on cardNumber
        return (
            <div className="card">
                <div className="card-body">
                    <div className="card-title">{`Card ${cardNumber} of ${cards.length}`}</div>
                    <div className="card-text">
                        {front ? currentCard.front : currentCard.back}
                    </div>
                    <button onClick={flipCard} className="btn btn-secondary mx-1">
                        Flip
                    </button>
                    {showNextButton()}
                </div>
            </div>
        );
    }

    // Render if not enough cards are available
    function notEnoughCards() {
        return (
            <div>
                <h2>Not enough cards.</h2>
                <p>
                    You need at least 3 cards to study. There are {cards.length}{" "}
                    cards in this deck.
                </p>
                <Link to={`/decks/${deck.id}/cards/new`} className="btn btn-primary mx-1">
                    Add Cards
                </Link>
            </div>
        );
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
                <li className="breadcrumb-item active">Study</li>
            </ol>
            <div>
                <h2>{`${deck.name}: Study`}</h2>
                <div>
                    {cards.length === 0
                        ? notEnoughCards()
                        : cards.length > 2
                        ? enoughCards()
                        : notEnoughCards()}
                </div>
            </div>
        </div>
    );
}

export default Study;
