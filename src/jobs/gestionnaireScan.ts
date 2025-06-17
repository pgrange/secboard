import { tousLesScans } from "../scans/listeScans";
import { randomUUID } from "crypto";

type ResultatScan = {
    nom: string;
    statut: "en cours" | "terminé" | "erreur";
    resultats?: Record<string, any>;
    erreur?: string;
};

type ResultatToutScans = {
    id: string;
    cible: string;
    statut: "en cours" | "terminé" | "erreur";
    scans: ResultatScan[];
}

const jobs = new Map<string, ResultatToutScans>();

export async function executeScan(cible: string): Promise<string> {
    const id = randomUUID();
    const resultatScans: ResultatToutScans = {
        id,
        cible: cible,
        statut: "en cours",
        scans: tousLesScans.map((scan) => ({
            nom: scan.nom,
            statut: "en cours"
        })),
    };

    jobs.set(id, resultatScans);

    // await (async () => {
    //     try {
    //         for (const scan of tousLesScans) {
    //             const sortie = await scan.execute(cible);
    //             resultatScans.resultats[scan.nom] = await scan.transformeSortie(sortie);
    //         }
    //         resultatScans.statut = "terminé";
    //     } catch (err) {
    //         resultatScans.statut = "erreur";
    //         resultatScans.erreur = String(err);
    //     }
    // })();
    //
    // return id;

    (async () => {
        const promesses = tousLesScans.map(async (scan, index) => {
            try {
                const sortie = await scan.execute(cible);
                const sortieTransforme = await scan.transformeSortie(sortie);
                resultatScans.scans[index].statut = "terminé";
                resultatScans.scans[index].resultats = sortieTransforme;
            } catch (err) {
                resultatScans.scans[index].statut = "erreur";
                resultatScans.scans[index].erreur = String(err);
            }
        });

        await Promise.allSettled(promesses);

        const aDesErreurs = resultatScans.scans.some(s => s.statut === "erreur");
        resultatScans.statut = aDesErreurs ? "erreur" : "terminé";
    })();

    return id;
}

export function recupereResultatScan(id: string): ResultatToutScans | undefined {
    return jobs.get(id);
}
