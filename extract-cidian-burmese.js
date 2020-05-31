const fs=require("fs")
const set="B",pat=/\[(.*?)\.?\]/g;
//const set="R", pat=/\((.*?)\)/g
const extract=()=>{

	const cidian=fs.readFileSync("../cidian.txt","utf8").split(/\r?\n/);

	console.log("loaded")
	const burmese=[];
	for (var i=0;i<cidian.length;i++){
		if (cidian[i][0]==set) {
			var w=cidian[i].substr(2);
			w=w.replace(/ṃ/g,"ṁ");
			burmese.push(w)
		}
	}

	fs.writeFileSync("burmesedict-"+set+".txt",burmese.join("\n"),"utf8");

}

const parsebreakup=()=>{
	const burmesedict=fs.readFileSync("burmesedict-"+set+".txt","utf8").split(/\r?\n/);
	var dict={};
	for (var i=0;i<burmesedict.length;i++){
		item=burmesedict[i];
		if (!item)continue;
		var at=item.indexOf(":");
		if (at==-1) {
			console.log("line",i)
			throw error;
		}
		var entry=item.substr(0,at);
		var def=item.substr(at+1);
		var bu=[];
		def.replace(pat,(m,m1)=>{
			//if (m1.indexOf("+")==-1) return
			//if (!m1.match(/[a-y]/))return;
			//var dot=m1.indexOf(".");
			//bu.push( dot==-1?m1:m1.substr(0,dot));
			bu.push(m1)
	
		});
		//if (bu.length) 
		dict[entry]=bu.join("|");
	}
	out=[];
	for (var w in dict) {
		out.push(w+"="+dict[w]);
	}
	console.log("writing")
	fs.writeFileSync("palibreakup-"+set+".txt",out.join("\n"),"utf8");
}
extract()
parsebreakup();