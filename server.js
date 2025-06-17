const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// En mémoire : { [domain]: { status, output } }
const scans = {};

app.post('/scan', (req, res) => {
    const domain = req.body.domain?.trim();

    if (!domain) return res.status(400).json({ success: false, error: "Nom de domaine manquant" });

    // Si le scan est déjà en cours ou terminé, ne pas relancer
    if (scans[domain]) {
        return res.json({ success: true, status: scans[domain].status });
    }

    // Sinon, on le marque en pending et on lance le scan
    scans[domain] = { status: 'pending', output: null };

    exec(`./scan "${domain}"`, (error, stdout, stderr) => {
        if (error) {
            scans[domain] = { status: 'error', output: stderr };
        } else {
            scans[domain] = { status: 'done', output: stdout };
        }
    });

    res.json({ success: true, status: 'pending' });
});

// Route de polling
app.get('/scan/:domain/status', (req, res) => {
    const domain = req.params.domain?.trim();

    if (!domain || !scans[domain]) {
        return res.status(404).json({ success: false, error: "Aucune tâche en cours ou passée pour ce domaine" });
    }

    const { status, output } = scans[domain];
    res.json({ success: true, status, output });
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

