const log=(msg,cls)=>{
	let ele=document.createElement("span");
	ele.className=cls||"";
	ele.innerHTML="<span class=datetime> "+((new Date()).getMilliseconds())+"</span>"+msg;
	logmessage.appendChild(ele);
}
module.exports=log;