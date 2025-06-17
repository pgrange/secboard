import { exec } from "child_process";
import { promisify } from "util";
import { Scan } from "./scan.interface";
import {transformeNmap} from "../transformateurs/nmap.transforme";

const execAsync = promisify(exec);

export class Nmap implements Scan {
    nom = "nmap";

    async execute(cible: string) {
        const { stdout } = await execAsync(`nmap -sV --script vulners --script-args mincvss=5.0 -oX - "${cible}"`);
        return stdout;
    }

    async transformeSortie(resultat: string) {
        return transformeNmap(resultat)
    }
}