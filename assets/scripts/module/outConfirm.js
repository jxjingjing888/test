var ui = require('uicreator');
var netConfig = require('NetConfig');
var Game = require('Game');

cc.Class({
    extends: cc.Component,

    properties: {
        

    },

	  onLoad () {
		 
		 
	 },

	
	outRoom:function(e,data){
		Game.instance.forceOut();
		this.node.destroy();
	},




    // onLoad () {},

    start () {

    },

	close:function(){
		 this.node.destroy();
	},

	onDestroy:function(){
	
      

    },

    // update (dt) {},
});
