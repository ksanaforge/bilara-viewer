const fs=require("fs");
const breakup=fs.readFileSync("./palibreakup-B.txt","utf8").split(/\r?\n/);
const dict={};
for (var i=0;i<breakup.length;i++){
	const line=breakup[i];
	const at=line.indexOf("=");
	var c=line.substr(at+1);
	if (c=="") c="*"
	dict[line.substr(0,at)]=c;
}
module.exports=dict;
