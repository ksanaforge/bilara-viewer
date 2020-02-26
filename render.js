const helpmsg=`<pre> ?partial 
endswith$
search only in scope 
when input turn green

<a target=_new href="https://github.com/ksanaforge/bilara-viewer">Offline Viewer</a> for <a target=_new href="https://github.com/suttacentral/bilara-data">bilara-data</a> 2020.2.23

Pure Client Side Javascript, may served by File:/// protocol 
require browser with es2015 support, tested platform:
PC        : Chrome (version 79 64bits)
Android   : UCBrowser v12
iOS 12/13 : Documents by Readdle
</pre>`

const MAXTERMTOKEN=10;
const MAXTEXT=40; 
const set="pitaka";
let searchrange=null;
const log=require("./logger");

const init=()=>{
	Dengine.setlogger(log);
}
const clearsearch=()=>{
	tofind.value="";
	tofind.focus();
}
const testfetch=(ele)=>{
	Dengine.fetchidarr(set,[ele.value],(data,db)=>{
				setStatus(JSON.stringify(data));
	});
}


const renderBookinfo=(bk,bookinfo)=>{
	if (Array.isArray(bookinfo[0])){ //two level
		return bookinfo.map( (item,idx)=>{
			let handler=item.length?"setsubbook":"setbook"
			return "<button class=serial book="+bk+" title="+ item.length+" onclick="+handler+"(this)>"
			+(idx+1)+"</button>" 
		}
		).join(" ")+"<br>";
	}
	return "";
}
window.setbook=ele=>{
	bk=ele.getAttribute("book");
	if (!bk)bk="";
	rowid.value=bk+ele.innerHTML;
	rowid.focus();
	idinput(rowid);
}
window.setsubbook=ele=>{
	rowid.value=ele.getAttribute("book")+ele.innerHTML+".";
	rowid.focus();
	idinput(rowid);
}
const renderSerial=serial=>{
	return "<span>"+serial.map( s=>"<button class=serial onclick=setbook(this)>"+s+"</button>").join(" ")+"</span>";
}

const showtext=(id)=>{
	const opts={prefix:id,max:100};
	Dengine.readpage(set,opts,(data,db)=>{
		rendertable(data,id,textpopup);
		showtextpopup();
	});
}
const selectsuggestion=ele=>{
	tofind.value=tofind.value.replace(ele.dataset.suggestion, event.target.innerHTML)
	tofind.focus();
}
const renderSuggestion=({matches,tofinds})=>{
	let out="<table><cellgroup>";
	for (var i=0;i<matches.length;i++){
		let term=matches[i];
		out+="<cell class=suggestion onclick='selectsuggestion(this)' data-suggestion='"+
		tofinds[i]+"'>";
		let count=0;
		for (match of term){
			out+= ((count>MAXTERMTOKEN)?"<span class=cancel>":"<span>")+
					match[0]
				+((count>MAXTERMTOKEN)?"</span>":"</span>")+"<br/>";
			count++;
		}
		out+="</cell>";
	}
	out+="</cellgroup></table>";
	document.getElementById("suggestionpopup").innerHTML=out;
}
const rendertable=(data,focusid,ele)=>{
	hidesuggestionpopup();
	if (!ele) {
		ele=document.getElementById("res");
	}
	let clickable='';
	idclickable = ele==document.getElementById("res");
	let out="<table>";

	const tfobj=Dengine.parseTofind(tofind.value);
	const hit="";
	for (var i=0;i<data.length;i++){
		let plitext=" "+data[i][1];
		let entext=" "+data[i][2];
		for (var j in tfobj){
			let pat=tfobj[j].renderexp;
			plitext=plitext.replace(pat,(m)=>"<span class=hit>"+m+"</span>" );
			entext=entext.replace(pat,(m)=>"<span class=hit>"+m+"</span>" );
		}

		let segid=data[i][0];
		clickable=(idclickable||i==0||i==data.length-1)?" onclick=showtext('"+segid+"')":
			" onclick=hidetextpopup()";
		let idclass=(focusid==segid)?"focussegid id=focussegid":"segid";
		out+="<cellgroup><cell class="+idclass+clickable+">"+segid.replace(":",": ")+"</cell><cell class=pli>"+plitext
		+"</cell><cell class=en>"+entext+"</cell></cellgroup>";
	}
	out+="</table>"
	ele.innerHTML=out;
	setTimeout(()=>{
		let scroll=0;
		if (focusid){
			let focusele=document.getElementById("focussegid");
			if (focusele){

			}
			scroll=focusele.getBoundingClientRect().top-50;
		}
		ele.scrollTop=scroll;
	},50);
}
var timestart=0;
const setStatus=msg=>{
	var elapsed=(new Date()).getMilliseconds()-timestart;
	res.innerHTML=msg +"(" +(elapsed?elapsed:"")+" ms)";
}
const dosearch2=()=>{
	hidesuggestionpopup();
	timestart=(new Date()).getMilliseconds();
	setStatus("loading tokens");
	const tfobj=Dengine.parseTofind(tofind.value);
	let tofindtoken={};
	for (var o of tfobj)tofindtoken[o.raw]=o.regex;
	Dengine.findtokens(set,tofindtoken,(data,db,lang)=>{
		setStatus("searching");
		let opts={maxtermtoken:MAXTERMTOKEN,searchrange};
		Dengine.search(set,lang,data,opts,(res,db)=>{
			let idarr=res.map( (item)=>db.seq2id(item[0]));
			if (idarr.length==0){
				if (searchrange){
					setStatus("Not found in scope, adjust and try again.");
				} else {
					setStatus("Not found.");
				}
				
				return;
			}
			if (idarr.length>MAXTEXT) {
				idarr.splice(MAXTEXT);
			}
			setStatus("fetching text");
			Dengine.fetchidarr(set,idarr,(data,db)=>{
				rendertable(data);
			});
		});
	});
}
const topWordWithCaret=(matches,tofindtokens)=>{ //topping word with caret
	let tf=tofind.value;
	let out=[],prev=0,wc=0;
	const selend=tofind.selectionEnd;
	const tfs=[].concat(tofindtokens);
	let tofinds=[];
	tf.replace(/ +/g,(m,m1)=>{
		if ((m1+1)>selend) {
			out.push( matches.splice(wc,1)[0])
			tofinds.push(tfs.splice(wc,1)[0]);
		}
		wc++;
	});
	if (out.length==0 && matches.length) {
		out.push(matches.splice(matches.length-1,1)[0]);
		tofinds.push(tfs.splice(tfs.length-1,1)[0]);
	}
	out =out.concat(matches);
	tofinds=tofinds.concat(tfs);
	return {matches:out,tofinds};
}
const dofindtokens=()=>{
	const tfobj=Dengine.parseTofind(tofind.value);
	let tofindtoken={};
	let tfs=[];
	for (var o of tfobj){
		tofindtoken[o.raw]=o.regex;
		tfs.push(o.raw)
	}
	Dengine.findtokens(set,tofindtoken,(data,db,lang)=>{
		let tokens=[];
		for (var i in data){
			tokens.push(data[i])
		}
		let m=topWordWithCaret(tokens,tfs);
		renderSuggestion(m);
	});		
}
const read=()=>{//dn16:0.2
	let prefix=rowid.value.toLowerCase().replace(/ /g,""); //space was added for reflow
	const opts={prefix,max:200}
	Dengine.readpage(set,opts,(data,db)=>{
		if (data) rendertable(data);
	});
}
const renderTOC=(ele)=>{
	searchrange=null;
	bookrange.innerHTML="";
	const prefix=ele.value.replace(/ /g,"").toLowerCase();
	Dengine.getbookrange(set,prefix,(range,db)=>{
		let bookinfo=null;
		if (range.range &&range.books){
			bookrange.innerHTML=range.books.length;
			searchrange=range.range;
			ele.classList.add("scope")
			searchbox.classList.add("scope");
			bookinfo=db.getHierarchy(prefix);
		}
		const blurb=db.getBlurb(prefix.replace(/\.$/,""));
		if (!bookinfo)bookinfo="";
		if (blurb){
			res.innerHTML=renderBookinfo(prefix,bookinfo)+blurb;
		} else{
			res.innerHTML=renderSerial(db.getSerials())+helpmsg;
		}
	});
}
const UI={
	renderTOC,read,dosearch2,dofindtokens,init
}
window.UI=UI;