let {renderTOC,read,dosearch2,dofindtokens,renderinit,URLParams,searchrange,
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
		if (i) {
			rowid.value=i;
			read();	
		} else {
			renderTOC(rowid);
		}
		
	},10);
}
const togglelogger=()=>logger.style.display=logger.style.display=="none"?"block":"none";
let lastrowid="";
const idinput=()=>{
	if ((event && event.key=="Enter")) {
		if (rowid.value.toLowerCase()=="log") {
			togglelogger();
			rowid.value="";
		} else {
			read();
		}
		lastrowid=rowid.value;
		return;
	}
	if (lastrowid!==rowid.value){
		renderTOC(rowid);
	}
	rowid.classList.remove("scope");
	fulltextbox.classList.remove("scope");		
	if (searchrange()){
		console.log("search range",searchrange)
		rowid.classList.add("scope")
		fulltextbox.classList.add("scope");
	}

	lastrowid=rowid.value;
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
	rowid.oninput=idinput;
	rowid.onkeyup=idinput;
	clearlogger.clearloggerclick;
	tofind.onkeyup=tofindinput;

}