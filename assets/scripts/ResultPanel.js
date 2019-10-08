

cc.Class({
    extends: cc.Component,

    properties: {

        winLabel: cc.Label,
        loseLabel: cc.Label,
	    winPanel:cc.Node,
		losePanel:cc.Node


    },
    onLoad: function () {
    },

    initPanel: function (isWin,txt) {
        if (isWin == true) {  // true: 获胜
          this.winLabel.string = txt;
		  this.winPanel.active = true;
		  this.losePanel.active = false;
        }
        else if (isWin == false) {    // false: 失败
            this.loseLabel.string = txt; 
			this.losePanel.active = true;
			this.winPanel.active = false;
        }

    },

    onClick: function () {
        
    },

	close:function(){
		if(this.node){
			 this.node.destroy();
		}  
	},

    onDestroy: function () {
	
    },


});
