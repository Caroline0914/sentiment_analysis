// let fs = require("fs");
// let globalConfig = require("./config");
//
// var controllerSet = [];
// var pathMap = new Map();
//
// function init(app) {
//     var files = fs.readdirSync(globalConfig["web_path"]);
//     for(var i = 0; i < files.length; i++) {
//         var temp = require("./" + globalConfig["web_path"] + "/" + files[i]);
//         if(temp.path) {
//             for(var [key, value] of temp.path) {
//                 if(pathMap.get(key) == null) {
//                     pathMap.set(key, value);
//                     app.get(key, value);
//                 } else {
//                     throw new Error("url path异常, url: " + key);
//                 }
//             }
//             controllerSet.push(temp);
//         }
//     }
// }
//
// module.exports.init = init;


let fs =require("fs");
let globalConfig = require("./config");

let controllerSet = [];
let pathMap = new Map();

let files = fs.readdirSync(globalConfig["web_path"]).filter(item => item.includes(".js"));
for (let i = 0 ; i < files.length ; i ++) {
    let temp = require("./" + globalConfig["web_path"] + "/" + files[i]);
    if (temp.path) {
        for (let [key, value] of temp.path) {
            if (pathMap.get(key) == null) {
                pathMap.set(key, value);
            } else {
                throw new Error("url path异常, url:" + key);
            }
        }
        controllerSet.push(temp);
    }
}
module.exports = pathMap;