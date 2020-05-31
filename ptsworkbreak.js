const fs=require("fs");
const spaces="                                              \r"
const fn="../pts-dhammakaya/data/pali1.json"
process.stdout.write("\rloading "+fn);
const pali1=JSON.parse(fs.readFileSync(fn,"utf8"));
process.stdout.write("\rjson loaded"+spaces);
const WORD_REGEX=/[a-zāīūñṅṇŋṁṃḍṭḷ\-]+/ig
let wc=0,wordbag={};
for (var i=0;i<pali1.length;i++){
	let text=pali1[i][2];
	if (!text)continue;
	text=text.replace(/\n/g,"");
	text.replace(WORD_REGEX,m=>{
		if (m.indexOf("-")==-1 || m[0]=="-" || m[m.length-1]=="-")return;
		if (!wordbag[m]) {
			wordbag[m]=0;
			wc++;
		}
		wordbag[m]++;
	});
}
process.stdout.write("parsed, unique wordcount "+spaces);
const out=[];
for (var w in wordbag){
	out.push([wordbag[w],w]);
}
out2=out.concat([]);
out.sort((a,b)=>b[0]-a[0]);
out2.sort((a,b)=>b[1].length-a[1].length);

for (var i=0;i<out.length;i++){
	out[i]=out[i].join("\t");
	out2[i]=out2[i].join("\t");
}
const outfn="pts-workbreak"
process.stdout.write("output "+outfn+" wordcount"+wc+spaces);
fs.writeFileSync(outfn+".txt",out.join("\n"),"utf8")
fs.writeFileSync(outfn+".bylen.txt",out2.join("\n"),"utf8")
