'use strict';
const helpmsg=`<pre> <a target=_new href="https://github.com/ksanaforge/bilara-viewer">Offline Viewer</a> for <a target=_new href="https://github.com/suttacentral/bilara-data">bilara-data</a> 2020.3.1

 vinnan  =&gt;  viññāṇaṃ  viññāṇe  viññāṇassa
 buddha$ =&gt;  buddhā    buddha 
 ?tabba$ =&gt;  veditabbā kātabbā  vattabba
 search only in scope 
 when input turn green

==change log==
2020.3.4
 concordance search
2020.3.1
 find similar sentence
 hash tag to store segment id
2020.2.29
 Full set of Pali tipitaka
 Click segment id of search result for neighbor segments. 
</pre>`

const MAXTERMTOKEN=10;
const MAXTEXT=40; 
const set="tipitaka";
let __searchrange=null;
const log=require("./logger");

const renderinit=()=>{
	Dengine.setlogger(log);
}
const clearsearchclick=()=>{
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
window.setshorthand=ele=>{
	rowid.value=ele.getAttribute("book");
	rowid.focus();
	rowid.oninput();
}
window.setbook=ele=>{
	let bk=ele.getAttribute("book");
	if (!bk)bk="";
	rowid.value=bk+ele.innerHTML;
	rowid.focus();
	rowid.oninput();
}
window.setsubbook=ele=>{
	rowid.value=ele.getAttribute("book")+ele.innerHTML+".";
	rowid.focus();
	rowid.oninput();
}
const renderSerial=db=>{
	let out='';
	let shorthand=Dengine.getshorthand();
	for (var s in shorthand) {
		out+="<button class=serial onclick=setshorthand(this) book='"+shorthand[s]+"'>"+s+"</button> ";
	}
	return "<span>"+out+db.getSerials().map( s=>"<button class=serial onclick=setbook(this)>"+s+"</button>").join(" ")
	+"</span>";
}

window.showtext=(id)=>{
	const opts={prefix:id,max:100};
	Dengine.readpage(set,opts,(data,db)=>{
		rendertable(data,{focusid:id,ele:textpopupbody});
		showtextpopup();
	});
}
window.selectsuggestion=ele=>{
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
		for (let match of term){
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
const hideselectionbox=()=>{
	document.getElementById("selectionbox").style.display='none';
	document.getElementById("singletermbox").style.display='none';
	document.getElementById("similarsentencebox").style.display='none';
	document.getElementById("fulltextbox").style.display='inline';
}
const showselectionbox=(lang,tofind,sid)=>{	
	let btn;
	
	hideselectionbox();
	const tokens=Dengine.tokenize(tofind.trim());
	if (tokens.length==1) {
		document.getElementById("singletermbox").style.display='inline';
		btn=document.getElementById("btnconcordance");
	} else {
		document.getElementById("similarsentencebox").style.display='inline'
		btn=document.getElementById("btnsentencesearch");
		lblomit.style.display='inline';	
	}

	if (btn.dataset.textbackup) btn.innerText=btn.dataset.textbackup;
	btn.disabled=false;
	btn.dataset.tofind=tofind;
	btn.dataset.sid=sid;
	btn.dataset.lang=lang;

 	let tm=document.getElementById("selectionbox");
	document.getElementById("selectionbox").style.display='inline';
	document.getElementById("fulltextbox").style.display='none';
}
const setSentenceStatus=msg=>{
	document.getElementById("btnsentencesearch").innerText=msg;
}
const disableselectionpanel=()=>{
	let btn=document.getElementById("btnsentencesearch");
	btn.disabled=true;
	btn.dataset.textbackup=btn.innerText;
	btn.innerText="Getting selection";
	lblomit.style.display='none';
}
let selectiontimer=0;
document.addEventListener('selectionchange', (event) => {
  clearTimeout(selectiontimer);
  selectiontimer=setTimeout(()=>{
  	const sel=document.getSelection();
  	if (!sel||!sel.baseNode)return;
  	const f=sel.baseNode.parentElement;
  	let tf=sel.toString().toLowerCase().trim();
  	hideselectionbox();
  	if (!tf) return;
  	let lang=f.dataset.lang||f.parentNode.dataset.lang;
  	let sid=f.parentElement.dataset.sid || f.parentElement.parentElement.dataset.sid;

	if (lang && sid) showselectionbox(lang,tf,sid);	 
  	
  },100);
  
});

const toggleomit=()=>{
	event.stopPropagation();
}
const sentencesearch=()=>{
	disableselectionpanel();
	const tf=btnsentencesearch.dataset.tofind;
	if (!tf)return;
	const sid=btnsentencesearch.dataset.sid;
	const lang=btnsentencesearch.dataset.lang;
  	setSentenceStatus("ready to search lang "+lang);
  	let exclude='';
  	if (document.getElementById("btnomit").checked) {
  		exclude=sid;
  		let at=exclude.indexOf(Dengine.SEGSEP);
  		exclude=exclude.substr(0,at);
  	}

	const tokens={};
	Dengine.tokenize(tf).forEach( item=>tokens[item]=[[item,-1]]);
	const highlight=highlightexp(tf);
	let opts={maxtermtoken:MAXTERMTOKEN,exclude,highlight,
		logger:setSentenceStatus,ele:document.getElementById("textpopupbody")};

	textsearch(lang,tokens,opts,(db)=>{
		hideselectionbox();
	});
}

const concordancestatus=(status)=>{
	document.getElementById("dictres").innerHTML=status;
}
const listconcordance=()=>{
	let centerword=btnconcordance.dataset.tofind;
	let concordword=event.target.innerText.trim();
	const tokens=[[centerword,[centerword,-1]],[concordword,[concordword,-1]]];
	const highlight=highlightexp(centerword+" "+concordword);
	const opts={ranking:"intersect",highlight,searchrange:__searchrange};
	const lang=btnconcordance.dataset.lang;
	textsearch(lang,tokens,opts,(db)=>{
		
	});
}
const renderConcordance=(data)=>{
	if (!data ||!data.length)return;
	var buttons = document.createDocumentFragment();
	data.slice(50);
	const max=data[0][1];
	let centerword=document.createElement("span");
	centerword.innerText="concordance of '"+data[0][0]+"' ";

	for (var i=1;i<data.length;i++){
		if (data[i][1]/max<0.01) break;
		const btn=document.createElement("span");
		btn.innerText=" "+data[i][0];
		btn.classList.add("concordtoken");
		btn.onclick=listconcordance;
		buttons.appendChild( btn);
	}
	const res=document.getElementById("dictres");
	res.innerHTML="";
	res.appendChild(centerword);
	res.appendChild(buttons);
}
const doconcordance=()=>{
	const tf=btnconcordance.dataset.tofind;
	if (!tf)return;
	btnconcordance.disabled=true;
	const sid=btnconcordance.dataset.sid;
	const lang=btnconcordance.dataset.lang;
	const opts={setstatus:concordancestatus,searchrange:__searchrange};
	Dengine.concordance(set,lang,tf,opts,(res,db)=>{
		btnconcordance.disabled=false;
		hideselectionbox();
		renderConcordance(res);
	})
}
const hidesuggestionpopup=()=>{
	setTimeout(()=>suggestionpopup.style.display="none",200)
}
const hidetextpopup=()=>textpopup.style.display="none";
const showtextpopup=()=>{
	textpopup.style.display="block";
	textpopup.scrollTop=0;
	hidesuggestionpopup();
}
const highlightexp=(str)=>{
	const tfobj=Dengine.parseTofind(str);
	let out=[];
	for (var j in tfobj){
		out.push(tfobj[j].renderexp)
	}
	return out;
}
const rendertable=(data,opts)=>{
	let {focusid,ele,idlink,highlight}=opts||{};
	hidesuggestionpopup();
	if (!ele) {
		ele=document.getElementById("res");
	}
	let clickable='';
	let idclickable = idlink || ele==document.getElementById("res");
	let out="<table>";

	
	const hit="";
	for (var i=0;i<data.length;i++){
		let plitext=" "+data[i][1];
		let entext=" "+data[i][2];
		if (highlight) {
			for (let pat of highlight){
				plitext=plitext.replace(pat,(m)=>"<span class=hit>"+m+"</span>" );
				entext=entext.replace(pat,(m)=>"<span class=hit>"+m+"</span>" );
			}
		}

		let segid=data[i][0];
		clickable=(idclickable||i==0||i==data.length-1)?" onclick=showtext('"+segid+"')":"";
		let idclass=(focusid==segid)?"focussegid id=focussegid":"segid";
		out+="<cellgroup data-sid='"+segid+"'><cell class="+idclass+clickable+">"+segid.replace(":",": ")
		+"</cell><cell data-lang=pli class=pli>"+plitext
		+"</cell><cell data-lang=en class=en>"+entext+"</cell></cellgroup>";
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

const textsearch=(lang,tokens,opts,cb)=>{
	Dengine.search(set,lang,tokens,opts,(res,db)=>{
		let idarr=res.map( (item)=>db.seq2id(item[0]));
		if (idarr.length==0){
			if (cb){
				cb('Not found');
				return;
			}
			if (opts.searchrange){
				setStatus("Not found in scope, adjust and try again.");
			} else {
				setStatus("Not found.");
			}
			
			return;
		}
		if (idarr.length>MAXTEXT) {
			idarr.splice(MAXTEXT);
		}
		if (opts.logger) opts.logger("fetching idarr "+idarr.length);
		Dengine.fetchidarr(set,idarr,(data,db)=>{
			if (typeof cb=="function") cb(db);
			rendertable(data,{focusid:'',highlight:opts.highlight,ele:opts.ele||document.getElementById("res"),idlink:true});
			if (opts.ele==textpopupbody)showtextpopup();

		});
	});
}

const cleardictres=()=>{
	document.getElementById("dictres").innerHTML="";
}
const dosearch2=()=>{
	hidesuggestionpopup();
	cleardictres();
	timestart=(new Date()).getMilliseconds();
	setStatus("loading tokens");
	const tf=tofind.value.trim();
	const tfobj=Dengine.parseTofind(tf);
	let tofindtoken={};
	for (var o of tfobj)tofindtoken[o.raw]=o.regex;
	Dengine.findtokens(set,tofindtoken,(data,db,lang)=>{
		setStatus("searching");
		setHash({q:tofind.value});
		const highlight=highlightexp(tf);
		let opts={maxtermtoken:MAXTERMTOKEN,highlight,
			ele:document.getElementById("res"),searchrange:__searchrange};
		
		textsearch(lang,data,opts);
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
const setHash=(newobj)=>{
	let hash=document.location.hash.substr(1);
	const p=new URLSearchParams(hash);
	for (var key in newobj){
		p.delete(key);
		if (newobj[key]) p.append(key,newobj[key]);
	}
	document.location.hash="#"+p.toString();
}
const URLParams=()=>{
	let hash=document.location.hash.substr(1);
	const p=new URLSearchParams(hash);
	const out={};
	p.forEach( (v,k)=>out[k]=v);
	return out;
}
const read=()=>{//dn16:0.2
	let prefix=rowid.value.toLowerCase().replace(/ /g,""); //space was added for reflow
	const opts={prefix,max:200}
	if (!prefix) setHash({i:null});
	Dengine.readpage(set,opts,(data,db)=>{
		if (data) {
			rendertable(data);
			setHash({i:prefix});
		}
	});
}
const renderTOC=(ele)=>{
	__searchrange=null;
	bookrange.innerHTML="";
	const nipata=ele.value.replace(/ /g,"").toLowerCase();
	Dengine.getbookrange(set,nipata,(r,db)=>{
		let bookinfo=null;
		let serials=db.getSerials();
		if ( r&&r.isscope && r.range){
			if (r.books) bookrange.innerHTML=r.books.length;
			ele.classList.add("scope")
			fulltextbox.classList.add("scope");
			if (r.single) bookinfo=db.getHierarchy(nipata);
			__searchrange=r.range;
		}
		const blurb=db.getBlurb(nipata.replace(/\.$/,""));
		if (!bookinfo)bookinfo="";
		if (blurb){
			res.innerHTML=renderBookinfo(nipata,bookinfo)+blurb;
		} else{
			res.innerHTML=renderSerial(db)+helpmsg;
		}
	});
}

const renderbindactions=()=>{
	btnsentencesearch.onclick=sentencesearch;
	btnomit.onclick=toggleomit;
	searchbutton.onclick=dosearch2;
	clearsearch.onclick=clearsearchclick;
	btnconcordance.onclick=doconcordance;
}

module.exports={renderTOC,read,dosearch2,dofindtokens,renderbindactions,renderinit,
hidetextpopup,hidesuggestionpopup,URLParams}