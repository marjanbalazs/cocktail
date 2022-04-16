import express from "express";
import axios from 'axios';
import { logger } from "./util";

const COCKTAIL_URL = process.env.COCKTAIL_URL;
const COCKTAIL_API_KEY = process.env.COCKTAIL_API_KEY;

const apiRouter = express.Router();

apiRouter.get('/cocktail', (req, res) => {
    logger.debug("Requesting random cocktail...");
    axios.get(`${COCKTAIL_URL}/${COCKTAIL_API_KEY}/random.php`)
    .then((resp) => res.json(resp.data))
    .catch((err) => {
        logger.error(JSON.stringify(err, null ,2));
        res.status(500);
    });
});

export default apiRouter;