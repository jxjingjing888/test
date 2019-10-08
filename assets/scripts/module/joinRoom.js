var ui = require('uicreator');
var netConfig = require('NetConfig');
var netControl = require('NetControl');
var Menu = require('Menu');

cc.Class({
    extends: cc.Component,

    properties: {
        joinRoomEditBox: cc.EditBox,
		enterNode: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
		 var roomNum = null;
		 
	 },

  onClickJoin: function () {
         var roomNum = this.joinRoomEditBox.string;
        if (roomNum.length == 0) {
           
            return;
        }
		//netControl._callBack = this.onMessage.bind(this);
        netControl.send('joinRoom',roomNum);
		


    },

	onMessage:function(msg){	
		var resData = JSON.parse(msg.data);
		console.log("joinRoom收到消息:"+resData);
        if (resData.type == 'joinRoom') {
           if (resData.status == false) {
				ui.createScreenMsg(resData.data);
                return;
			}
			netConfig.userData.roomId = resData.data.roomNum;
			netConfig.userData.roomTypeName = resData.data.roomTypeName;
			netConfig.userData.roomMoney = resData.data.money;
			Menu.instance.audioMng.pauseMusic();
            cc.director.loadScene('table');
        }
		//进入房间初始化用户数据


	},

    start () {

    },
	
	close:function(){
		 this.node.destroy();
	},

	onDestroy:function(){
	
      

    },

    // update (dt) {},
});
