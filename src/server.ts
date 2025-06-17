import express, {NextFunction, Request, Response} from "express";
import {executeScan, recupereResultatScan} from "./jobs/gestionnaireScan";

const app = express();
const PORT = 8080;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

app.post('/scan', async (req: Request, res: Response) => {
    const domain = req.body.domain?.trim();

    if (!domain) return res.status(400).json({success: false, error: "Nom de domaine manquant"});

    const id = await executeScan(domain);

    res.json({ id });
});

app.get("/scan/:id", async (req, res) => {
    const result = recupereResultatScan(req.params.id);
    if (!result) {
        return res.status(404).json({ error: "Scan not found" });
    }
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

