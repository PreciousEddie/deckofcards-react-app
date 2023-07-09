import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CardDeck.css"

const CardDeck = () => {
    const [deckId, setDeckId] = useState(null);
    const [cardsRemaining, setCardsRemaining] = useState(null);
    const [drawnCards, setDrawnCards] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);
    useEffect(() => {
        async function loadCardDeck() {
            try {
                const res = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
                setDeckId(res.data.deck_id);
                setCardsRemaining(52);
            } catch (error) {
                console.error("Error:", error);
            }
        }
        loadCardDeck();
    }, [])
    const drawCard = async () => {
        if (cardsRemaining === 0) {
            alert("Error: No cards remaining!")
            return;
        }
        try {
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
            const { cards } = res.data;
            if (cards.length === 0) {
                alert("Error: No cards remaining!");
            } else {
                setDrawnCards((prevDrawnCards) => [...prevDrawnCards, cards[0]]);
                setCardsRemaining((prevRemaining) => prevRemaining - 1);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error: Failed to draw a card.");
        }
    };
    const shuffleDeck = async () => {
        if (isShuffling) return;
        try {
            setIsShuffling(true);
            setCardsRemaining(52);
            setDrawnCards([]);
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
            if (res.data.success) {
                alert("Deck shuffled successfully!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error: Failed to shuffle the deck.");
        } finally {
            setIsShuffling(false);
        }
    };
    return (
        <div className="CardDeck-container">
            <div className="CardDeck-btn-container">
                <button onClick={ drawCard } disabled={ isShuffling }>
                    Draw Card
                </button>
                <button onClick={ shuffleDeck } disabled={ isShuffling }>
                    Shuffle Deck
                </button>
            </div>
            <div className="CardDeck-card-container">
                { drawnCards.map((card, index) => (
                    <img
                        key={ index }
                        src={ card.image }
                        alt={ card.code }
                        className={ `card card-${index + 1}` }
                    />
                )) }
            </div>
        </div>
    );
};

export default CardDeck;