var netConfig = require('NetConfig');
var netControl = require('NetControl');
var httpHelper = require('httpHelper');
var ui = require('uicreator');
var Menu =  cc.Class({
    extends: cc.Component,

    properties: {
        audioMng: cc.Node,
		totalMoney:cc.Label
    },

    // use this for initialization
    onLoad: function () {
		Menu.instance = this;
		netControl._callBack = this.onMessage.bind(this);
		netControl.send('heartbeat', '');
		 this.init();
        this.audioMng = this.audioMng.getComponent('AudioMng');
		var yinXiao = cc.sys.localStorage.getItem('yinXiao');
		if(yinXiao == '1' || yinXiao == null){
			this.audioMng.playMusic();
			cc.audioEngine.setEffectsVolume(1);
		}else if(yinXiao == '0' ){
		   this.audioMng.pauseMusic
			cc.audioEngine.setEffectsVolume(0);
		}
		
        
        cc.director.preloadScene('table', function () {
           cc.log('Next scene preloaded');
        });
       
    },

    playGame: function (event,data) {
		var tokenid = cc.sys.localStorage.getItem('tokenid');
		if(tokenid == null || tokenid ==''){
			cc.sys.openURL('/lwgame/f/portal/login.html');
			return;
		}
		netControl.send('matchRoom', data);
       
    },
    //
    start: function () {
      
	 
    },

	init:function(){
	  //setTimeout(function() {
       //     netControl.send('getUserInfo', '');
       // }.bind(this), 100);
	   var tokenid = cc.sys.localStorage.getItem('tokenid');
	   if(tokenid ==null || tokenid =='' ){
		   return;
	   }
	   httpHelper.get('/lwgame/f/dice/userInfo?tokenid='+tokenid,  (isSuccess, msg) => {
		 if(isSuccess){
			 console.log(msg);
			 var data = JSON.parse(msg);
			 if (data.status != 200) {
				ui.createScreenMsg(data.data);
                return;
			}
			netConfig.userData.userId = data.data.userId;
			netConfig.userData.realName = data.data.realName;
			netConfig.userData.img = data.data.img;
			netConfig.userData.money = data.data.money;
			 this.totalMoney.string = netConfig.userData.money;  
		 }
	   });
	},


	
	onMessage:function(msg){	
		console.log("menu.js收到消息:"+msg.data);
		var data = JSON.parse(msg.data);
		if (data.status == false) {
				ui.createScreenMsg(data.data);
                return;
			}
        if (data.type == 'createNewRoom') {
            netConfig.userData.roomId = data.data.roomNum;
			netConfig.userData.roomTypeName = data.data.roomTypeName;
			netConfig.userData.roomMoney = data.data.money;
			 this.audioMng.pauseMusic();
            cc.director.loadScene('table',function(){
				
			});//end load scene
			
        }else if(data.type == 'getUserInfo'){
			netConfig.userData.userId = data.data.userId;
			netConfig.userData.realName = data.data.realName;
			netConfig.userData.img = data.data.img;
			netConfig.userData.money = data.data.money;
			 this.totalMoney.string = netConfig.userData.money;
		}else if(data.type == 'matchRoom'){
			netConfig.userData.roomId = data.data.roomNum;
			netConfig.userData.roomTypeName = data.data.roomTypeName;
			netConfig.userData.roomMoney = data.data.money;
			 this.audioMng.pauseMusic();
			 cc.director.loadScene('table',function(){
				
			});//end load scene
		}else if (data.type == 'joinRoom') {
           if (data.status == false) {
				ui.createScreenMsg(data.data);
                return;
			}
			netConfig.userData.roomId = data.data.roomNum;
			netConfig.userData.roomTypeName = data.data.roomTypeName;
			netConfig.userData.roomMoney = data.data.money;
			Menu.instance.audioMng.pauseMusic();
            cc.director.loadScene('table');
        }else if(data.type == 'logout'){
			cc.sys.openURL('/lwgame/f/portal/login.html');
		}


	},

	createRoom: function () {	
		ui.createCreateRoom();

       
    },

    joinRoom: function () {
        ui.createJoinRoomPanel();

       
    },

	createHowToPlayPanel: function () {
        ui.createHowToPlayPanel();
       
    },

   creatSettingPanel: function () {
        	ui.settingPanel();
       
    },


	



		
	chongzhi:function(){
		cc.sys.openURL('/lwgame/f/mobile/drechange');
	},
	

    // called every frame
    update: function (dt) {

    },
	onDestroy:function(){
       

    },
});
