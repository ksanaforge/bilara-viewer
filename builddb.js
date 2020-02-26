const fs=require("fs");
const argv=process.argv.slice(2);
let set=argv[0]||"nikaya-dn";
let rawfn=set+"-raw.txt"
const raw=fs.readFileSync(rawfn,"utf8").split(/\r?\n/);

const {build}=require("dengine");

build({name:set,outdir:set+"/",fields:["pli","en"] },raw);