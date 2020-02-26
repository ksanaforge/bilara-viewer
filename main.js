
var formComponent={
	template:`<p>
		{{appName}} HI<label>:{{inputLabel}}:</label><input type="text" v-model="name"></input>
	</p>`,
	props:['title','name'],
	data:function(){
		return {
			inputLabel:'your Name',
			appName:'My demo'
		}
	}
}
const startui=()=>{
	new Vue({
		el:"#example",
		data:{
			appName:'demo',
			userName:'yap',
			hello:'hello,world'},
		methods:{
			handleClick(){
				alert("hello")
			}
		},
		components:{
			'form-component':formComponent
		}
	})
}
module.exports=startui;