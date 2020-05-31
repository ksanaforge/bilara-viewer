const fs=require("fs")
const wordfreq=require("./wordfreq");
const set="nikaya-pli";//
//nikaya-en 1,851,231 ,        nikaya-pli 1,471,486
//bu-vi-en  767,052            bu-vi-pli  517,525 ,
const content=fs.readFileSync("./"+set+".txt","utf8").split(/\r?\n/);
const words={};
var total=0;
const breakup=t=>{
	const tk=t.split(/[-.;$():? +,…«»“‘”—’]/);
	for (var i=0;i<tk.length;i++){
		const w=tk[i].toLowerCase();
		if (!words[w]) words[w]=0;
		words[w]++;
		total++;
	}
}

for (var line of content){
	breakup(line);
}
console.log("total word",total);
const freq=wordfreq(words);
fs.writeFileSync(set+"-stat.txt",freq.join("\n"),"utf8")