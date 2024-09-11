import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";

function App() {
    return (
        <div className="app-routes">
            <Routes>
                <Route path="/" element={<Layout />} /> {/* Use element prop for rendering */}
            </Routes>
        </div>
    );
}

export default App;

