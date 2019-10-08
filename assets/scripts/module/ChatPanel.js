var netConfig = require('NetConfig');
var netControl = require('NetControl');
var ui = require('uicreator');
var Game = require('Game');

cc.Class({
    extends: cc.Component,

    properties: {
        editBox: cc.EditBox,
    },

    // use this for initialization
    onLoad: function () {

    },

    convenientTalk: function (e,content) {
       
	   var sendData = {
				"talkType": 'normal',
				"message": content
			};
			var sendString = JSON.stringify(sendData);
			Game.instance.playerActorRenderer.showTalk(content);

			netControl.send('talk',sendData);

        this.node.active = false;
    },

    faceTalk: function (e,picId) {
        var sendData = {
				"talkType": 'face',
				"message": picId
			};
			var sendString = JSON.stringify(sendData);
			Game.instance.playerActorRenderer.showFaceTalk(content);

			netControl.send('talk',sendData);

        this.node.active = false;
    },

    onClickTalk: function () {
        var content = this.editBox.string;
        if (content == null || content.length <= 0) {
           // ui.createScreenMsg('请输入聊天内容');
		   return false;
        }
        else {
   
			var sendData = {
				"talkType": 'normal',
				"message": content
			};
			var sendString = JSON.stringify(sendData);
			Game.instance.playerActorRenderer.showTalk(content);

			netControl.send('talk',sendData);

			this.editBox.string = "";
        
        }
    },
	onMessage:function(msg){	
		var data = JSON.parse(msg.data);
		console.log("talk收到消息:"+data);
        if (data.type == 'talk') {
           // if (data.status == false) {
			//	ui.createScreenMsg(data.data);
            //   return;
			//}
			ui.createScreenMsg(data.data);
        }


	},

    onClickDisable: function () {
      //  this.node.active = false;
    },

    onDestroy: function () {
        if (this.game) {
            this.game.chatPanel = null;
        }
		
    },



    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
