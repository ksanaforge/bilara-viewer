const fs=require("fs");
const set="nikaya";
const bigstr=fs.readFileSync(set+"-id-sorted.txt","utf8")
const idarr=bigstr.split(/\r?\n/);
var prev=''
let out=[];
for (id of idarr){
	let at=id.indexOf(':');
	let bookid=id.substr(0,at);
	let sentenceid=id.substr(at+1);
	if (bookid==prev) {
		out.push(sentenceid);
	} else {
		out.push(":"+id);
		prev=bookid;
	}
}
const outstr=out.join("\n");
fs.writeFileSync(set+"-id-pack.txt",outstr,"utf8");
console.log("compress ratio",(outstr.length/bigstr.length).toFixed(2))