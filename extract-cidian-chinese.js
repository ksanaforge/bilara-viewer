const fs=require("fs")
const set="F",pat=/\[(.*?)\.?\]/g; //F%巴漢詞典
//const set="R", pat=/\((.*?)\)/g
const extract=()=>{

	const cidian=fs.readFileSync("./cidian.txt","utf8").split(/\r?\n/);

	console.log("loaded")
	const ccped=[];
	for (var i=0;i<cidian.length;i++){
		if (cidian[i][0]==set) {
			var w=cidian[i].substr(2);
			w=w.replace(/ṃ/g,"ṁ");
			const items=w.split(/,/);
			items[0]=items[0].toLowerCase();
			ccped.push( items.join(","));
		}
	}
	//remove repeated
	const out=[];
	let last='';
	for (var i=0;i<ccped.length;i++) {
		if (ccped[i]!==last) out.push(ccped[i]);
		last=ccped[i];
	}
	out.sort();

	console.log("output palihan.js repeat entries:",ccped.length-out.length)


	fs.writeFileSync("palihan.js",
		"module.exports=`"+out.join("\n")+"`","utf8");
}

extract()