import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import NotFound from "./NotFound";
import Home from "../Components/Home";
import CreateDeck from "../Components/CreateDeck";
import Deck from "../Components/Deck";
import Study from "../Components/Study";
import EditDeck from "../Components/EditDeck";
import AddCard from "../Components/AddCard";
import EditCard from "../Components/EditCard";

function Layout() {
  return (
    <div>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/decks/new" element={<CreateDeck />} />
          <Route path="/decks/:deckId" element={<Deck />} />
          <Route path="/decks/:deckId/study" element={<Study />} />
          <Route path="/decks/:deckId/edit" element={<EditDeck />} />
          <Route path="/decks/:deckId/cards/new" element={<AddCard />} />
          <Route path="/decks/:deckId/cards/:cardId/edit" element={<EditCard />} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all route for unmatched paths */}
        </Routes>
      </div>
    </div>
  );
}

export default Layout;

