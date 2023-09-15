const fs = require("fs").promises
const path = require("path")

//Informing server about assets.(Linking the background image in assets folder)
//app.use('/data',express.static(path.join((__dirname,'public/data'))))
var folderName_ = path.join((__dirname,'public/data'));
console.log(folderName_);
async function readNamesFromFiles(nameFiles) {
    let names = [];

    for (file of nameFiles) {
        const data = JSON.parse(await fs.readFile(file));
        names.push(data[0].user)
    }

    return names;
}

async function getNameFiles(folderName) {
    let nameFiles = []

    const items = await fs.readdir(folderName, {withFileTypes: true})

    for (item of items) {
        if (!item.isDirectory()) {
            if (path.extname(item.name) === ".json") {
                nameFiles.push(path.join(folderName, item.name))
            }
        }
    }
    return nameFiles
}

async function main() {
    const nameFolder = path.join(__dirname, folderName_)

    const nameFiles = await getNameFiles(nameFolder)
    const names = await readNamesFromFiles(nameFiles)

    await fs.writeFile(
        path.join(__dirname, "names.txt"),
        names.join(', '),
        { flag: "a"}
    )
}

//main()

module.exports = { main };;