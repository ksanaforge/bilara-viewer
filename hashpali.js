
const dediacritic=[
[/[ṁṃmŋ]+/g,'m'],
[/[dḍ]+/g,'d'],
[/[lḷ]+/g,'l'],
[/[ṅñṇ]+/g,'n'],
[/[tṭ]+/g,'t'],
[/ā/g,'a'],
[/ū/g,'u'],
[/ī/g,'i'],
[/kk/g,'k'],
[/yy/g,'y'],
[/ss/g,'s'],
[/cc/g,'c'],
[/bb/g,'b'],
[/pp/g,'p'],
[/gg/g,'g'],
[/jj/g,'j'],
]
const removevowel=(w)=>{
	return w.replace(/[aeiou]+/g,"").replace(/([kctpgjb])h/,"$1");
}
const normalize=(w)=>{
	let o=w;
	for (var i=0;i<dediacritic.length;i++){
		let ded=dediacritic[i];
		o=o.replace(ded[0],ded[1])
	}
	return o;
}
const hashPali=(w,maxlen=5)=>{
	let n=normalize(w);
	if (n.length<=maxlen)return n;
	
	n=removevowel(n);
	if (n.length<=maxlen)return n;

	return n.substr(0,maxlen-1)+n.charAt(n.length-1);
}
if (typeof module!="undefined"){
	module.exports=hashPali;
} else {
	window.hashPali=hashPali;
}