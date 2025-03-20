import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [numberId, setNumberId] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`http://localhost:5000/numbers/${numberId}`);
            setResponse(res.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch data');
            setResponse(null);
        }
    };

    return (
        <div className="container">
            <h1>Average Calculator Microservice</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={numberId}
                    onChange={(e) => setNumberId(e.target.value)}
                    placeholder="Enter number ID (p, f, e, r)"
                />
                <button type="submit">Submit</button>
            </form>
            {error && <p className="error">{error}</p>}
            {response && (
                <div className="response">
                    <h2>Response:</h2>
                    <p>Previous Window State: {JSON.stringify(response.windowPrevState)}</p>
                    <p>Current Window State: {JSON.stringify(response.windowCurrState)}</p>
                    <p>Numbers: {JSON.stringify(response.numbers)}</p>
                    <p>Average: {response.avg}</p>
                </div>
            )}
        </div>
    );
};

export default App;