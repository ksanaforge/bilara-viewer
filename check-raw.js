const fs=require("fs");
const set="bu-vi";////nikaya
const checkid=()=>{
	const idarr=fs.readFileSync(set+"-id.txt","utf8").split(/\r?\n/)
	for (id of idarr) {
		if (id.indexOf(":")==-1) {
			console.log("invalid id,"+id);
		}
	}
}
checkid()