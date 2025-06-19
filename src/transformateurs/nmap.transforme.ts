import xml2js from 'xml2js';

const computeGrade = (json: Record<string, any>) => {
    let grade = 'A';
    if (json.open_ports.length > 2 && json.open_ports.filter((open_port: any) => open_port.service.id == 80 || open_port.service.id == 443).length > 0) {
        grade = 'B';
    }
    const totalVulnerabilities = json.open_ports.reduce((accumulator: number, open_port: any) => accumulator + open_port.service.vulnerabilities.length, 0);
    if (totalVulnerabilities > 0) {
        grade = totalVulnerabilities > 20 ? 'F' : totalVulnerabilities > 10 ? 'E' : totalVulnerabilities > 5 ? 'D' : 'C';
    }
    return grade;
};

export const transformeNmap = async (xmlData: string) => {
    const parser = new xml2js.Parser();
    const donnees = await parser.parseStringPromise(xmlData);

    const json: Record<string, any> = {};
    json['host'] = donnees.nmaprun.host[0].hostnames[0].hostname[0].$.name;
    json['protocol'] = donnees.nmaprun.scaninfo[0].$.protocol;
    json['closed_ports'] = donnees.nmaprun.host[0].ports[0].extraports[0].$.count;
    json['open_ports'] = [];
    const open_ports = donnees.nmaprun.host[0].ports[0].port;
    open_ports?.forEach((port: Record<string, any>) => {
        const open_port: Record<string, any> = {};
        open_port['service'] = {};
        open_port['service']['name'] = port.service[0].$.name
        open_port['service']['product'] = port.service[0].$.product
        open_port['service']['id'] = port.$.portid
        open_port['service']['version'] = port.service[0].$.version
        open_port['service']['vulnerabilities'] = [];
        let vulnerabilities = [];
        if (port.script) {
            port.script.forEach((script: Record<string, any>) => {
                if (script.table && script.table.length > 0 && script.table[0].table) {
                    vulnerabilities = script.table[0].table;
                    vulnerabilities.forEach((vulnerability: Record<string, any>) => {
                        if (vulnerability && vulnerability.elem && vulnerability.elem.length > 2) {
                            const vuln_elem: Record<string, any> = {};
                            vulnerability.elem.forEach((elem: Record<string, any>) => {
                                vuln_elem[elem.$.key] = elem._;
                            });
                            open_port['service']['vulnerabilities'].push(vuln_elem);
                        }
                    });
                }
            });
        }
        json['open_ports'].push(open_port);
    });
    json['grade'] = computeGrade(json);

    return json;
};