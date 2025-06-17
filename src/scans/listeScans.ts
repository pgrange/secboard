import { Scan } from "./scan.interface";
import { Nmap } from "./nmap.scan";

export const tousLesScans: Scan[] = [
    new Nmap(),
];