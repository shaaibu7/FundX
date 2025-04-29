require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const africasTalking = require('./services/africasTalkingService');



const app = express();

app.use(express.json());
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.get('/', (req, res) => {
    res.send("Interacting with safiri platform")
});

app.post('/', africasTalking.ussdAccess);


sequelize.sync({ alter: true }).then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
});
  