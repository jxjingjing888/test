var Game = require('Game');

cc.Class({
    extends: cc.Component,

    properties: {

    },

   onLoad:function(){
		
	  

   },

   start () {

    },

   playYao:function(){
   
   	 
		var animalCompant = this.getComponent(cc.Animation);
	    animalCompant.play('yaoyiyaoOther');

   
   },

   playYaoMove:function(){
   
   	    var animalCompant = this.getComponent(cc.Animation);

	    animalCompant.play('yaoyiyaoOhterMove');

   
   },

   onAnimEndListener:function(){
    Game.instance.playerDice.showDice();
    
   
   },

	init:function(diceArray,diceDemo){
	

	},



	destoryNode:function(){
		if(this.node){
			this.node.destroy();
		}
		
	},

    // update (dt) {},
});
