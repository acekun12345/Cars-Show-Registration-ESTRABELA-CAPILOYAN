const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const venues = [
  { id: 1, name: 'Auditorium Hall', capacity: 200, price: 5500 },
  { id: 2, name: 'Conference Room', capacity: 15, price: 3500 },
  { id: 3, name: 'Presentation Room', capacity: 50, price: 700 },
  { id: 4, name: 'Large Meeting Room', capacity: 10, price: 900 },
  { id: 5, name: 'Small Meeting Room', capacity: 5, price: 500 }
];

const addons = [
  { id: 1, name: 'Projectors', price: 200 },
  { id: 2, name: 'Speakers', price: 35 },
  { id: 3, name: 'Microphones', price: 45 },
  { id: 4, name: 'Whiteboards', price: 80 },
  { id: 5, name: 'Signage', price: 80 }
];

const meals = [
  { id: 1, name: 'Breakfast', price: 50 },
  { id: 2, name: 'High Tea', price: 25 },
  { id: 3, name: 'Lunch', price: 65 },
  { id: 4, name: 'Dinner', price: 70 }
];

app.get('/api/venues', (req, res) => res.json(venues));
app.get('/api/addons', (req, res) => res.json(addons));
app.get('/api/meals', (req, res) => res.json(meals));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));