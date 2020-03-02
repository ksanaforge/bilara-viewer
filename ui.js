let {renderTOC,read,dosearch2,dofindtokens,renderinit,URLParams,
	hidetextpopup,hidesuggestionpopup,renderbindactions}=require("./render");

const clearlogger=()=>{
	logmessage.innerHTML="";
}



window.init=()=>{
	const {q,i}=URLParams();
	if (q) {
		tofind.value=q;
	}

	logger.style.display="none";
	tofind.onblur=hidesuggestionpopup;
	suggestionpopup.style.display="none";
	hidetextpopup();
	renderinit();
	bindactions();
	renderbindactions();
	setTimeout(()=>{
		rowid.value=i;
		read();	
	},10);
}
const togglelogger=()=>logger.style.display=logger.style.display=="none"?"block":"none";
const idinput=()=>{
	if ((event && event.key=="Enter")) {
		if (rowid.value.toLowerCase()=="log") {
			togglelogger();
			rowid.value="";
		} else {
			read();
		}
		return;
	}
	rowid.classList.remove("scope");
	searchbox.classList.remove("scope");

	renderTOC(rowid);
}
let inputtimer=0;
const tofindinput=()=>{
	if (tofind.value.length) {
		suggestionpopup.style.display="";
	} else {
		suggestionpopup.style.display="none";
	}
	clearTimeout(inputtimer);
	if (event &&event.key=="Enter") {
		dosearch2();
	} else {
		inputtimer=setTimeout(()=>{
			dofindtokens();
		},250)
	}
}
const bindactions=()=>{
	closetextpopup.onclick=hidetextpopup;
	rowid.onkeyup=idinput;
	clearlogger.clearloggerclick;
	tofind.onkeyup=tofindinput;
}