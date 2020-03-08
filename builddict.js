const fn="ncped.json";
const fs=require("fs");
const dictjson=JSON.parse(fs.readFileSync(fn,"utf8"));
const out=[];
const grammars={}

const Gcode={adjective:"adj",masculine:"M",neuter:"N",feminine:"F",
absolutive:"abs","present 3 singluar":"p3s","past participle":"pp",
"aorist":"aor","past participle adjective":"ppadj"
,"present participle adjective":"padj"
,"present participle":"p",
"future passive participle adjective":"fppadj",
"causative present 3 singular":"c3s",
indeclinable:"i","aorist 3 singluar":"aor3s",
adverb:"adv",
"negative adjective":"-adj",
infinitive:"inf",
"masculine, neuter":"M N",
"adjective & neuter":"adj N"
}
const grammarcode=(g)=>Gcode[g]?Gcode[g]:g;

const parse=(json)=>{
	for (var i=0;i<json.length;i++){
		let {entry,grammar,definition,homonyms,xr}=json[i];
		if (Array.isArray(xr)) xr=xr.join("$");
		if (homonyms){
			let hcount=0;
			for (j=0;j<homonyms.length;j++){
				const g=homonyms[j].grammar;
				let xr=homonyms[j].xr;
				if (Array.isArray(xr)) xr=xr.join("$");
				hcount++;
				if (g&& !grammars[g]) grammars[g]=0;
				if (g) grammars[g]++;

				out.push((entry+hcount)+"|"+grammarcode(g)+"|"+homonyms[j].definition+"|"+xr);
			}
		}else {
			const g=grammar;
			let def=Array.isArray(definition)?definition.join("$"):definition;
			if (!def)def="";
			if (!xr)xr="";
			if (g&&!grammars[g]) grammars[g]=0;
			if (g) grammars[g]++;

			out.push(entry+"|"+grammarcode(g)+"|"+def+"|"+xr)
		}

	}
}

parse(dictjson);

fs.writeFileSync("ncped.txt",out.join("\n"),"utf8");
const G=[];
for (var g in grammars) G.push([g,grammars[g]]);
G.sort((a,b)=>b[1]-a[1]);

fs.writeFileSync("ncped-grammar.txt",G.join("\n"),"utf8");
