const fs = require('fs');
const pdf = require('pdf-page-counter');
const countNumberOfPages = async (fileLocation) => {
    try {
        let dataBuffer = await fs.readFileSync(fileLocation);
       return pdf(dataBuffer).then(function (data) {
            console.log("data ::", data);
            return data.numpages;
        })

    } catch (err) {
        throw err;
    }
}

module.exports={
    countNumberOfPages 
}