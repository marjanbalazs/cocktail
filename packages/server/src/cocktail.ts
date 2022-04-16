import express from "express";
import axios from 'axios';
import { logger } from "./util"; 

const COCKTAIL_URL = process.env.COCKTAIL_URL;
const COCKTAIL_API_KEY = process.env.COCKTAIL_API_KEY;

const apiRouter = express.Router();

apiRouter.get('/cocktail', (req, res) => {
    const queryParams = req.query;
    // I would separate the endpoints though
    if (queryParams.name) {
        logger.debug("Requesting coctail with name:", queryParams.name)
        axios.get(`${COCKTAIL_URL}/${COCKTAIL_API_KEY}/search.php`, {
            params: {
                s: queryParams.name,
            }
        })
        .then((resp) => res.json(resp.data))
        .catch((err) => {
            logger.error(JSON.stringify(err, null ,2));
            res.status(500);
        });
    } else {
        logger.debug("Requesting random cocktail...");
        axios.get(`${COCKTAIL_URL}/${COCKTAIL_API_KEY}/random.php`)
        .then((resp) => res.json(resp.data))
        .catch((err) => {
            logger.error(JSON.stringify(err, null ,2));
            res.status(500);
        });
    }
});

export default apiRouter;