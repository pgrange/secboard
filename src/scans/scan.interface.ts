export interface Scan {
    nom: string;
    execute(cible: string): Promise<string>;
    transformeSortie(resultat: string): Promise<Record<string, any>>;
}