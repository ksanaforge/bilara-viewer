const argv=process.argv.slice(2);
let bigfile=argv[0];
let maxpagesize=parseInt((argv[1]||"").replace(/k/i,"000").replace(/m/i,"000000"))|| 128*1024 ;

const fs=require("fs");
const lines=fs.readFileSync(bigfile,"utf8").split(/\r?\n/);

console.log("breaking",bigfile,"into pages not bigger than",maxpagesize);

const {createpages}=require("dengine");

const setname=bigfile.substr(0,bigfile.lastIndexOf("."));
const foldername=bigfile.substr(0,bigfile.indexOf("."));

const pages=createpages(lines,maxpagesize);
const outdir=fs.existsSync(foldername)?foldername+"/":"";

for (var i=0;i<pages.length;i++){
	let outfn=outdir+setname+(i?"."+i:"")+".js";

	var prolog='jsonp({setname:"'+setname+'",page:'+i+',start:'+pages.meta.pagestart[i];
	if (i==0) {prolog+= ",meta:{"+JSON.stringify(pages.meta)+"}"}; 
	prolog += ',\`' ;
	let str=pages[i].join("\n").replace(/\\/g,"\\\\").replace(/`/g,"\\`");
	console.log("create pagefile",outfn,"length",str.length);
	fs.writeFileSync( outfn , prolog+str+"`})","utf8");
}
