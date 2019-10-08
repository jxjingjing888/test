
cc.Class({
    extends: cc.Component,

    properties: {
       dices: {
            default: [],
            type: cc.Sprite
        },
    },

   onload:function(){
	dice.instance = this;
   },


    start () {

    },

	init:function(diceArray,diceDemo){
		for(var i=0;i<5;i++){
			 //cc.loader.loadRes((diceArray[i])+'dian',cc.SpriteFrame,function (err,spriteFrame) {
			//	 this.dices[i].spriteFrame = spriteFrame;
			//});
			//var url = ''+(diceArray[i])+'dian';
			//this.loadImg(this.dices[i],url);
			this.dices[i].spriteFrame = diceDemo[diceArray[i]-1].spriteFrame;
		}

	},
	loadImg: function(container,url){
		cc.loader.loadRes(url,cc.SpriteFrame, function (err, spriteFrame) {
			if(!err){
			 var sprite  = new cc.SpriteFrame(spriteFrame);
			container.spriteFrame = sprite;	
			}

		});
	},
    
	showDice:function(){
		this.node.active=true;
	}
	,
	destoryNode:function(){
		if(this.node){
			this.node.destroy();
		}
		
	},

    // update (dt) {},
});
