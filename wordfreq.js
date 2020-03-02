module.exports=(words)=>{
	const o=[];
	for (var w in words){
		o.push([words[w],0,w]);
	}
	o.sort((a,b)=>b[0]-a[0]);

	if (o[0][2]=="") {
		o.shift();
	}
	var acc=0,total=0;
	for (var i=0;i<o.length;i++) {
		total+=o[i][0];
	}
	wordcount=total;
	for (var i=0;i<o.length;i++) {
		acc+=o[i][0];
		o[i][1]=((acc/total)*100).toFixed(2)+"%"
	}
	return o;
}
