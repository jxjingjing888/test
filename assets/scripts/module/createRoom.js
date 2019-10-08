var ui = require('uicreator');
var netConfig = require('NetConfig');
var netControl = require('NetControl');
var Menu = require('Menu');

cc.Class({
    extends: cc.Component,

    properties: {
        audioMng: cc.Node,
        roomType: 'primary',
    },

	  onLoad () {
		
		 
	 },

	
	selectRoom:function(e,data){
		this.roomType = data;
	
	},


  onClickCreateRoom: function () {
        
		netControl._callBack = this.onMessage.bind(this);
        netControl.send('createNewRoom',this.roomType);
		this.node.destroy();


    },

	onMessage:function(msg){	
		var resData = JSON.parse(msg.data);
		if (resData.status == false) {
			   
				ui.createScreenMsg(resData.data);
                return;
	    }
        if (resData.type == 'createNewRoom') {
			  Menu.instance.audioMng.pauseMusic();
            netConfig.userData.roomId = resData.data.roomNum;
			netConfig.userData.roomTypeName = resData.data.roomTypeName;
			netConfig.userData.roomMoney = resData.data.money;

            cc.director.loadScene('table');
        }
		//进入房间初始化用户数据


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
