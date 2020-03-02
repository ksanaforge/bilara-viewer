const fs=require("fs");
const breakups=require("./breakups");
const fuzzymatch=require("./fuzzymatchpali");


console.log("breakups loaded");
const words=fs.readFileSync("./bilara-words.txt","utf8").split(/\r?\n/);
const unbreakable=[];
for (var i=0;i<words.length;i++) {
	var w=words[i].replace(/ṃ/g,"ṁ");
	var u=typeof breakups[w]=="undefined";
	if (!u) {
		continue;	
	}

	const r=fuzzymatch(breakups,w);
	if (!r) unbreakable.push(w);
}

unbreakable.sort((a,b)=>b.length-a.length);
console.log(unbreakable.length+" unbreakable")
fs.writeFileSync("./unbreakable.txt",unbreakable.join("\n"),"utf8");