import express from 'express';
import axios from 'axios';

const app = express();

app.get("/liveness", (req, res) => {
    res.json({
        status: "Ok",
    }).send();
});

app.listen(3000, () => console.log("Backend running on 3000"));
