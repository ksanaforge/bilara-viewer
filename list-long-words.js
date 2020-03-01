const fs=require("fs");
const argv=process.argv.slice(2);
let set=argv[0]||"tipitaka";
let rawfn=set+"-raw.txt"
const raw=fs.readFileSync(rawfn,"utf8").split(/\r?\n/);
const LIMIT=10;
const HITLIMIT=10;
const {tokenize}=require("dengine");
const wordbag={};
const _longwords=require("./longwords").split(/\r?\n/);
const longwords={};
for (var i=0;i<_longwords.length;i++){
	const w=_longwords[i];
	longwords[ w.replace(/\-/g,"")]=w;
}


console.log("tokenizing");
for (var i=0;i<raw.length;i++){
	const tokens=tokenize(raw[i]);
	tokens.forEach(tk=>{
		if (longwords[tk]) return;
		if (tk.length>LIMIT) {
			if (!wordbag[tk]) wordbag[tk]=0;
			wordbag[tk]++
		}
	})
}

let o=[];
for (var w in wordbag){
	o.push([wordbag[w],w]);
}
o=o.filter(a=>a[0]>=HITLIMIT||a[1].length>25);
o.sort((a,b)=>b[1].length-a[1].length);
for (var i=0;i<o.length;i++){
	o[i]=o[i].join("\t");
}
console.log("length>",LIMIT,"hit>",HITLIMIT,",wordcount",o.length);
fs.writeFileSync(set+".longwords.txt",o.join("\n"),'utf8');