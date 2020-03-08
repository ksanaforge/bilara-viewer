// create a big raw json from bilara dataset
const fs=require("fs");
const argv=process.argv.slice(2);
let set=argv[0]||"nikaya-dn";
const rootfile=fs.readFileSync("./"+set+"-pli.lst","utf8").split(/\r?\n/);
const enfile=fs.readFileSync("./"+set+"-en.lst","utf8").split(/\r?\n/);
const {LANGSEP,comparesegment,TOKEN_REGEX}=require("dengine");

const _longwords=require("./longwords").split(/\r?\n/);
const longwords={};
for (var i=0;i<_longwords.length;i++){
	const w=_longwords[i];
	longwords[ w.replace(/\-/g,"")]=w;
}

const expand=(t,longtokens)=>{
	return t.replace(TOKEN_REGEX,(w)=>{
		return longwords[w]?longwords[w]:w
	});
}

const bag={};
var attr="";
const dofile=(raw)=>{
	for (var key in raw) {
		if (!bag[key]) bag[key]={};
		let t=expand(raw[key]);
		bag[key][attr]=t;
	}
}


attr="pli"
console.log(set+"-"+attr);
rootfile.forEach(n=> {
	if (!fs.existsSync(n)) {
		console.log("not found",n);
		return;
	}
	process.stdout.write("\r"+n+"                                      ");
	const d=fs.readFileSync(n,"utf8");
	dofile(JSON.parse(d))
});


attr="en"
console.log(set+"-"+attr);
enfile.forEach(n=>{
	if (!fs.existsSync(n)) {
		console.log("not found",n);
		return;
	}
	process.stdout.write("\r"+n+"                                      ");
	const d=fs.readFileSync(n,"utf8");
	dofile(JSON.parse(d))
});



const keys=[];
const pli=[],en=[];

const dataset=[];
for (var key in bag) {
	dataset.push([key,(bag[key].pli||"")+LANGSEP+(bag[key].en||"")])
}

dataset.sort((a,b)=> comparesegment(a[0],b[0]));


dataset.forEach((item)=>item[0]=item[0]
		.replace(/^pli-tv-/,"")
		.replace(/^bu-vb-/,"")
		.replace(/^bi-vb-/,"i")
		.replace(/^bu-pm/,"pm")
		.replace(/^tha-ap/,"ap")
		.replace(/^thi-ap/,"iap")
		.replace(/^bi-pm/,"ipm")
		)
		
console.log("writing")
fs.writeFileSync(set+"-raw.txt",dataset.join("\n"),"utf8");
