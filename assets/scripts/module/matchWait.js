

cc.Class({
    extends: cc.Component,

    properties: {
       timeOutLable:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
		
		this.setTxt();
	 
	 },



     setTxt:function(){
		this.times = 0;
		 this.interval = setInterval(()=>{
			  this.times ++;
			  if(this.timeOutLable){
				  this.timeOutLable.string='已等待'+this.times+'s';	
			  }
			
		 },1000);
	 },

   	close:function(){
		 clearInterval(this.interval);
		 if(this.node !=null){
			 this.node.destroy();
		 }
		 
	},

    start () {
		
    },

    // update (dt) {},
});
