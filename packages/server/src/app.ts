import 'dotenv/config'
import express from 'express';
import path from 'path';
import { logger } from './util';
import cocktail from './cocktail';

const PORT = process.env.PORT;

const app = express();

app.get("/liveness", (req, res) => {
    res.json({
        status: "Ok",
    });
});

// Serve static content
app.use('/cocktail', express.static(path.join(__dirname, '/static')));

// Serve API
app.use('/api', cocktail);

app.listen(PORT, () => logger.debug("App running on port:", PORT));
