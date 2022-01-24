//-----empty respone if pnr not sletected and clicked donload button
//-----else if function 
//-----input validaton


const express = require("express")
const app = express();
const bodyParser = require('body-parser');
const multer = require("multer")

const xlsx = require("xlsx");

const fs = require("fs")

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {

    res.render('index')

});


const filestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '--' + file.originalname)
    }
})


const PNR = multer({
    storage: filestorage
}).single("PNR")

app.post('/convert', PNR , async (req, res, next) => {

    try{

    //    console.log(req)
    const fullName = req.file.filename;

    
    const wb = xlsx.readFile('./uploads/' + fullName, {cellDates: true})
    const fullNamePnr = fullName.split("--");
    const fullPnr = fullNamePnr[1];
    const finalname = fullPnr.split(" ");
    const airlineCode = finalname[1];

    if (airlineCode === "I.xlsx" || airlineCode === "i.xlsx") {

        const ws = wb.Sheets["Sheet1"]
        ws["!ref"] = "A2:K100"
        const jsonsheet = xlsx.utils.sheet_to_json(ws)
        
        jsonsheet.pop()

        const finalsheet = jsonsheet.map((record) => {

            delete Object.assign(record, {
                ["Pax Type"]: record["SL"]
            })["SL"]

            record["Pax Type"] = "Adult"

            delete Object.assign(record, {
                ["TITLE"]: record["Title"]
            })["Title"]
            delete Object.assign(record, {
                ["Title"]: record["TITLE"]
            })["TITLE"]


            const dot = record.Title.indexOf(".");
            if (dot > 0) {
                record.Title = record.Title.replace('.', '')
            }
            if (record.Title === "Mr") {
                record.Gender = "Male"
            }
            if (record.Title === "Mrs") {
                record.Gender = "Female"
            }
            if (record.Title === "Ms") {
                record.Gender = "Female"
            }
            if (record.Title === "Miss") {
                record.Title = "Ms";
                record.Gender = "Female"
            }
            if (record.Title === "Mstr") {
                record.Title = "Mr";
                record.Gender = "Male"
            }


            delete Object.assign(record, {
                ["FIRST NAME"]: record["First Name"]
            })["First Name"]
            delete Object.assign(record, {
                ["First Name"]: record["FIRST NAME"]
            })["FIRST NAME"]


            delete Object.assign(record, {
                ["LAST NAME"]: record["Last Name"]
            })["Last Name"]
            delete Object.assign(record, {
                ["Last Name"]: record["LAST NAME"]
            })["LAST NAME"]


            record["Date of Birth (DD-MMM-YYYY)"] = '28-OCT-1989'


            record["Contact"] = "9800830000"
            record["Email"] = "info.airiq@gmail.com"



            delete record["Billing A/C"]
            delete record["Login ID"]
            delete record["Price"]
            delete record["Entry Date"]
            delete record["AQ ID"]
            delete record["Display Pnr "]
            delete record["Supplier"];

            return record
        })

        try {
            const nb = xlsx.utils.book_new();
            const newsheet = xlsx.utils.json_to_sheet(finalsheet)
            xlsx.utils.book_append_sheet(nb, newsheet, "Sheet1");

            const namelist = finalname[0] + " NAMELIST INDIGO.xlsx"

            xlsx.writeFile(nb, namelist, {
                type: 'file'
            })


            fs.unlink('./uploads/' + fullName, (err) => {
                if (err) throw err;
                console.log("/uploads/" + fullName + "delted sucessfully")
            })

            res.download(namelist, (err) => {
                if (err) {
                    console.log(err)
                } else {

                    fs.unlink(namelist, (err) => {
                        if (err) throw err;
                        console.log("NAMELIST.xlsx" + "delted sucessfully")
                    })
                }
            })

        } catch (err) {
            console.log(err)
            res.redirect('./?true=' + "Oooops Something Went Wrong......");
        }

    }
    else if (airlineCode === "G.xlsx" || airlineCode === "g.xlsx") {


        const ws = wb.Sheets["Sheet1"]
        ws["!ref"] = "A2:K100"
        const jsonsheet = xlsx.utils.sheet_to_json(ws)
        jsonsheet.pop()


        const finalsheet = jsonsheet.map((record) => {

            delete Object.assign(record, {
                ["TYPE"]: record["SL"]
            })["SL"]

            record.TYPE = "Adult"

            delete Object.assign(record, {
                ["TITLE"]: record["Title"]
            })["Title"]

            delete Object.assign(record, {
                ["FIRST NAME"]: record["First Name"]
            })["First Name"]
            delete Object.assign(record, {
                ["LAST NAME"]: record["Last Name"]
            })["Last Name"]

            record["DOB"] = '28/10/1989'

            const dot = record.TITLE.indexOf(".");
            if (dot > 0) {
                record.TITLE = record.TITLE.replace('.', '')
            }
            if (record.TITLE === "Mr") {
                record.GENDER = "Male"
            }
            if (record.TITLE === "Mrs") {
                record.GENDER = "Female"
            }
            if (record.TITLE === "Ms") {
                record.GENDER = "Female"
            }
            if (record.TITLE === "Miss") {
                record.TITLE = "Ms";
                record.GENDER = "Female"
            }
            if (record.TITLE === "Mstr") {
                record.TITLE = "Mr";
                record.GENDER = "Male"
            }

            record["MOBILE NUMBER"] = "9800830000"

            delete record["Billing A/C"]
            delete record["Login ID"]
            delete record["Price"]
            delete record["Entry Date"]
            delete record["AQ ID"]
            delete record["Display Pnr "]
            delete record["Supplier"];

            return record
        })

        try {
            const nb = xlsx.utils.book_new();
            const newsheet = xlsx.utils.json_to_sheet(finalsheet)
            xlsx.utils.book_append_sheet(nb, newsheet, "Sheet1");

            const namelist = finalname[0] + " GOAIR NAMELIST.xlsx"

            xlsx.writeFile(nb, namelist, {
                type: 'file'
            })

            fs.unlink('./uploads/' + fullName, (err) => {
                if (err) throw err;
                console.log("/uploads/" + fullName + "delted sucessfully")


                res.download(namelist, (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        fs.unlink(namelist, (err) => {
                            if (err) throw err;
                            console.log("NAMELIST.xlsx" + "delted sucessfully")
                        })
                    }
                })


            })
        } catch (err) {
            console.log(err)
            res.redirect('./?true=' + "Oooops Something Went Wrong......");
        }



    }
    else if (airlineCode === "A.xlsx" || airlineCode === "a.xlsx") {

        const ws = wb.Sheets["Sheet1"]
        ws["!ref"] = "A2:K100"
        const jsonsheet = xlsx.utils.sheet_to_json(ws)
        jsonsheet.pop()

        const finalsheet = jsonsheet.map((record) => {

            delete Object.assign(record, {
                ["TYPE"]: record["SL"]
            })["SL"]

            record.TYPE = "Adult"

            delete Object.assign(record, {
                ["TITLE"]: record["Title"]
            })["Title"]

            delete Object.assign(record, {
                ["FIRST NAME"]: record["First Name"]
            })["First Name"]
            delete Object.assign(record, {
                ["LAST NAME"]: record["Last Name"]
            })["Last Name"]

            record["DOB (DD/MM/YYYY)"] = '28/10/1989'

            const dot = record.TITLE.indexOf(".");
            if (dot > 0) {
                record.TITLE = record.TITLE.replace('.', '')
            }
            if (record.TITLE === "Mr") {
                record.GENDER = "Male"
            }
            if (record.TITLE === "Mrs") {
                record.GENDER = "Female"
            }
            if (record.TITLE === "Ms") {
                record.GENDER = "Female"
            }
            if (record.TITLE === "Miss") {
                record.TITLE = "Ms";
                record.GENDER = "Female"
            }
            if (record.TITLE === "Mstr") {
                record.TITLE = "Mr";
                record.GENDER = "Male"
            }

            record["MOBILE NUMBER"] = "9800830000"

            delete record["Billing A/C"]
            delete record["Login ID"]
            delete record["Price"]
            delete record["Entry Date"]
            delete record["AQ ID"]
            delete record["Display Pnr "]
            delete record["Supplier"];

            return record
        })

        try {

            const nb = xlsx.utils.book_new();
            const newsheet = xlsx.utils.json_to_sheet(finalsheet)
            xlsx.utils.book_append_sheet(nb, newsheet, "Sheet1");

            const namelist = finalname[0] + " AIRASIA NAMELIST.xlsx"

            xlsx.writeFile(nb, namelist, {
                type: 'file'
            })

            fs.unlink('./uploads/' + fullName, (err) => {
                if (err) throw err;
                console.log("/uploads/" + fullName + "delted sucessfully")


                res.download(namelist, (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        fs.unlink(namelist, (err) => {
                            if (err) throw err;
                            console.log("NAMELIST.xlsx" + "delted sucessfully")
                        })
                    }
                })


            })

        } catch (err) {
            console.log(err)
            res.redirect('./?true=' + "Oooops Something Went Wrong......");
        }

  
    }
         }catch(err){   res.redirect('/')  } 
        
    })

app.listen({port: 8000}, () => {
    console.log("server started")
})
