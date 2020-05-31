const input=`Kiṁ  saṅghassa  pubbakiccaṁ?   Pārisuddhiṁ  āyasmanto  ārocetha.
什麼     僧團          之前    做            清淨           大德          宣告
 ka      saṅgha     grd. of pubba+kicca     pārisuddhi        āyasmant       āroceti
n.s.Nom.  m.s.Gen.            n.s.Nom.        f.s.Acc.         m.p.Voc.      2p.imp.
僧團事前應做什麼呢？諸大德！請宣告清淨。`;

/*
correctoutput=
"Kiṁ"		,"saṅghassa","pubbakiccaṁ?",""			,"Pārisuddhiṁ"	,"āyasmanto","ārocetha."

"什麼"		,"僧團"		,"之前"		,"做"			,"清淨"			,"大德"		,"宣告"
"ka"		,"saṅgha"	,"grd. of pubba","kicca"	,"pārisuddhi"	,"āyasmant"	,"āroceti"
"n.s.Nom."	,"m.s.Gen."	,"n.s.Nom.","n.s.Nom."		,"f.s.Acc."		,"m.p.Voc."	,"2p.imp."

"{僧團2}事前應{做3}{什麼1}呢？諸{大德5}！請{宣告6}{清淨4

}。"
*/
//"[[\"grd\",4],[\"ppr\",7],[\"pp\",32],[\"caus\",1],[\"ger\",1]]"  <==/([a-z]+)\. of /g
const paliwords={};
const breakwords=(s)=>{
	//const words=s.split(/[+()’‘,“” .　?-@'+/\[\]]/);
	const words=s.split(/[ ()]/); //for grammar
	for (var k=0;k<words.length;k++){
		//if (!words[k])return
		var w=words[k].toLowerCase()

		if (!paliwords[w]) paliwords[w]=0
		paliwords[w]++;
	}	
}

const parsegroup=g=>{
	for (i=0;i<g.length;i++){
		const lines=g[i].text;
		for (var j=0;j<lines.length;j++){
		//1366,1069
		//2319	
			//breakwords(lines[j].pali);
			breakwords(lines[j].grammar);
		}

	}
}
const parse=()=>{
	const out=[];
	var obj=null,group={};
	var ln=0;
	const keys={0:"pali",1:"zh_word",2:"pli_word",3:"grammar",4:"zh"};
	lines=patimokkha.split("\n")
	for (var i=0;i<lines.length;i++) {
		const line=lines[i];
		if (line.charAt(0)=="{") {
			if (obj) out.push(obj);

			obj=JSON.parse(line);
			obj.text=[];
			ln=0;
		} else {
			if (line.trim()) {
				if (ln==0) group={};
				group[ keys[ln++] ]=line;

			} else {
				ln=0;
				if (group) obj.text.push(group);
				group=null;
			}
		}

	}
	parsegroup(out);
	o=[];
	var k=1;
	for (var w in paliwords){
		o.push([w,paliwords[w]]);
	}
	o.sort((a,b)=>b[1]-a[1])

	if (o[0][0]=="") {
		o.shift();
	}
	//for (var i =0;i<o.length;i++){
	//	o[i]=[i+1, o[i][0],o[i][1]];
	//}

	return "total:"+o.length+"<br>"+o.join(" <br>");
}
const exporting={
	parse:parse
};
if (typeof module!=="undefined") {
	module.exports=exporting;
} else {
	window.parser=exporting;
}