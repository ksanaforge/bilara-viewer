const words=require("./bilara-words");

const maxlen=6;

const hashwords={};

const hashpali=require("./hashpali");
for (var w of words) {
	let o=hashpali(w,maxlen);
	if (!hashwords[o]) hashwords[o]=0;
	hashwords[o]++
}
console.log("sorting")
const wordfreq=require("./wordfreq");
const o=wordfreq(hashwords);
var tokenlengths=0;
o.forEach( tk=> tokenlengths+=tk[2].length )
const fs=require("fs");
const out1=tokenlengths+"\n"+o.join("\n").replace(/,/g,"\t\t");
fs.writeFileSync("bilara-hashtoken-report.txt",out1,"utf8");

const oo=[];
o.forEach( tk=> oo.push(tk[2]) )
oo.sort();
fs.writeFileSync("bilara-hashtoken.txt",oo.join("\n"),"utf8");