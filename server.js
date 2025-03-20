const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const windowSize = 10;
let numbersWindow = [];

const fetchNumbers = async (numberId) => {
    const urls = {
        'p': 'http://20.244.56.144/test/primes',
        'f': 'http://20.244.56.144/test/fibo',
        'e': 'http://20.244.56.144/test/even',
        'r': 'http://20.244.56.144/test/rand'
    };

    try {
        const response = await axios.get(urls[numberId], { timeout: 500 });
        return response.data.numbers || [];
    } catch (error) {
        console.error(`Error fetching numbers for ${numberId}:`, error);
        return [];
    }
};

const calculateAverage = (numbers) => {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
};

app.get('/numbers/:numberId', async (req, res) => {
    const { numberId } = req.params;

    if (!['p', 'f', 'e', 'r'].includes(numberId)) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    const newNumbers = await fetchNumbers(numberId);
    const uniqueNewNumbers = [...new Set(newNumbers)];

    const previousWindow = [...numbersWindow];

    uniqueNewNumbers.forEach(num => {
        if (!numbersWindow.includes(num)) {
            if (numbersWindow.length >= windowSize) {
                numbersWindow.shift();
            }
            numbersWindow.push(num);
        }
    });

    const currentWindow = [...numbersWindow];
    const average = calculateAverage(currentWindow);

    res.json({
        windowPrevState: previousWindow,
        windowCurrState: currentWindow,
        numbers: newNumbers,
        avg: average.toFixed(2)
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});