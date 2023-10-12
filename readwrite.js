const fs = require("fs").promises
const path = require("path")
process.env.TZ = "Asia/Calcutta";
console.log(new Date().toString());

var requestedPassword="";
var requestCredential = {
    email : "",
    password : ""
};


//Informing server about assets.(Linking the background image in assets folder)
//app.use('/data',express.static(path.join((__dirname,'public/data'))))
var folderName_ = path.join((__dirname,'public/data'));

//var dt_datePicker=Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: '2-digit'}).format(new Date());
var dt_datePicker=Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long', timeZone: 'Asia/Calcutta' }).format(new Date())
console.log(folderName_);

const keyFilter = function keyFilter(user) {
    return function keyFilterMethod(item) {
       return item.user === user;
    }
 };

async function readNamesFromFiles(nameFiles,requestCredential) {
    let names = [];

    // create an object with properties "id", "action" with mock values
    var object = {
        id: "",
        loginStatus: "" ,
        email:"",
        password:"",
        room:"",
        accessdate:""
    }

    for (file of nameFiles) {
        const data = JSON.parse(await fs.readFile(file));
        const requestedItem = data.find(keyFilter(requestCredential.email));
        if (typeof requestedItem !== 'undefined' && requestedItem !== null){
            requestedPassword = requestedItem.password;
            if (requestCredential.email==requestedItem.user && requestCredential.password==requestedItem.password)
            {                
                object.id=requestedItem.id;
                object.loginStatus="true";
                object.email=requestCredential.email;
                object.password=requestedItem.password;            
                object.room=requestedItem.room;
                object.accessdate=dt_datePicker;
                names.push(object);                
                //names.push(requestedItem.email)
            }
            else{
                object.id="0";
                object.loginStatus="false";
                object.email=requestCredential.email;
                object.password="na";            
                object.room="na";            
                object.accessdate=dt_datePicker;
                names.push(object);    
            }
         }       
         else{
            object.id="0";
            object.loginStatus="false";
            object.email=requestCredential.email;
            object.password="na";            
            object.room="na";            
            object.accessdate=dt_datePicker;
            names.push(object);
            //names.push(requestCredential.email + ' Not Found\n');
         }
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

async function main(requestCredential) {
    const nameFolder = path.join(__dirname, folderName_);
    const nameFiles = await getNameFiles(nameFolder);
    const names = await readNamesFromFiles(nameFiles,requestCredential);
    const arr_login = [];

    if (typeof names !== 'undefined' && names !== null){

        if (names.length !=0){
            arr_login.push(names[0].email ,names[0].loginStatus,names[0].accessdate,'\n');
        }       

    }    

    try {
        if (arr_login!=0){
            await fs.writeFile(
                path.join(__dirname, "names.txt"),
                arr_login.join(', '),
                { flag: "a"}
            )
        }
    } catch (e) {
    console.log(e); // will log an error because file already exists
  }

    return names;
}

//Export to main method()
module.exports = { main };