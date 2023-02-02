import fetch  from 'node-fetch';
import AdmZip from 'adm-zip';
import iconv  from 'iconv-lite';
import xml2js from "xml2js"

const ParseXml = async () =>{
    const ArrayObjectXml = []

    async function downloadFile(url) {
        const response = await fetch(url);
        const buffer = await response.buffer();

        const zip = new AdmZip(buffer);
        
        const zipEntries = zip.getEntries();

        return zipEntries[0];
    }

    await downloadFile('http://www.cbr.ru/s/newbik')
    .then(data => {
        const xml = iconv.decode(Buffer.from(data.getData()), 'win1251');
        
        const parser = new xml2js.Parser();

        parser.parseString(xml, function (err, result) {
            const firstKeyResult = Object.keys(result)[0]

            for(let key of result[firstKeyResult].BICDirectoryEntry)
            {
                if(key.Accounts)
                {
                    const objectXml = {
                        bic: key['$'].BIC, 
                        name: key.ParticipantInfo[0]['$'].NameP, 
                        corrAccount: key.Accounts[0]['$'].Account
                    }
                    ArrayObjectXml.push(objectXml)
                }
            }
        });
    })
    .catch(error => {
        console.error(error);
    });
    console.log(ArrayObjectXml);
}
ParseXml()