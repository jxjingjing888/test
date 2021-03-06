var ui = new Object();

ui.createScreenMsg = function (msg) {
    cc.loader.loadRes("ScreenMessage", (err, prefab)=>{
        if (!err) {
            var node = cc.instantiate(prefab);
            cc.director.getScene().getChildByName('Canvas').addChild(node);
            node.setPosition(cc.p(0, 0));
            node.getComponent("ScreenMessage").showMessage(msg);
        }
    });
};




ui.createHowToPlayPanel = function () {
    cc.loader.loadRes("prefabs/howToPlayPrefab ", (err, prefab)=>{
        if (!err) {
            var node = cc.instantiate(prefab);
            cc.director.getScene().getChildByName('Canvas').addChild(node);
            node.setPosition(cc.p(0, 0));
        }
    });
};









ui.createResultPanel = function (status ,data) {
    cc.loader.loadRes("prefabs/resultPanel", (err, prefab)=>{
        if (!err) {
            var node = cc.instantiate(prefab);
            cc.director.getScene().getChildByName('Canvas').addChild(node);
            node.getComponent('ResultPanel').initPanel(status,data);
        }
    });
};



ui.createChatPanel = function (callback) {
    cc.loader.loadRes("ChatPanel", (err, prefab)=>{
        if (!err) {
            var node = cc.instantiate(prefab);
            cc.director.getScene().getChildByName('Canvas').addChild(node);
            if (callback) {
                callback(node);
            }
        }
    });
};



ui.createPlayer = function (userData,anchor,playerPrefab) {
			var playerNode = cc.instantiate(playerPrefab);
            anchor.addChild(playerNode);
            playerNode.position = cc.v2(0, 0);
			 

            var playerInfoPos = cc.find('anchorPlayerInfo', anchor).getPosition();
            var actorRenderer = playerNode.getComponent('ActorRenderer');
            actorRenderer.init(userData, playerInfoPos);
	
};

ui.createCreateRoom = function () {
    cc.loader.loadRes("prefabs/createRoomPrefab", (err, prefab)=>{
        if (!err) {
            var node = cc.instantiate(prefab);
            cc.director.getScene().getChildByName('Canvas').addChild(node);
            node.setPosition(cc.p(0, 0));
        }
    });
};

ui.createJoinRoomPanel = function () {
    cc.loader.loadRes("prefabs/joinRoomPrefab", (err, prefab)=>{
        if (!err) {
            var node = cc.instantiate(prefab);
            cc.director.getScene().getChildByName('Canvas').addChild(node);
            node.setPosition(cc.p(0, 0));
        }
    });
};


ui.createUseDices = function (dices,anchor,diceDemo) {
    cc.loader.loadRes("prefabs/dicePrefab", (err, prefab)=>{
        if (!err) {
            var node = cc.instantiate(prefab);
			var dice = node.getComponent('dice');
			dice.init(dices,diceDemo);
			//for(var i=0;i<5;i++){
				//dice.dices[i].spriteFrame = new cc.SpriteFrame(cc.url.raw('textures/UI/'+(i+1)+'dian.png'));;

				//cc.loader.loadRes((i+1)+'dian',cc.SpriteFrame,function (err,spriteFrame) {
				 // dice.dices[i].spriteFrame = spriteFrame;
				//});

			//}
			 anchor.addChild(node);
           // node.position = cc.v2(0, 0);
            //var playerInfoPos = cc.find('diceLy', anchor).getPosition();

			
			
            
        }
    });
};



ui.createSelectNumPanel = function (num,dice,zai,fei,myZai,myFei,player) {
      cc.loader.loadRes("prefabs/choosePrefab", (err, prefab)=>{
        if (!err) {
            var node = cc.instantiate(prefab);
			var choose = node.getComponent('Choose');
			choose.init(num,dice,zai,fei,myZai,myFei,player);
			cc.director.getScene().getChildByName('Canvas').addChild(node);
	
            
        }
    });
};

ui.settingPanel = function () {
      cc.loader.loadRes("prefabs/settingPrefab", (err, prefab)=>{
        if (!err) {
            var node = cc.instantiate(prefab);
			cc.director.getScene().getChildByName('Canvas').addChild(node);
	
            
        }
    });
};

ui.outConfirmPanel = function () {
      cc.loader.loadRes("prefabs/outConfirmPrefab", (err, prefab)=>{
        if (!err) {
            var node = cc.instantiate(prefab);
			cc.director.getScene().getChildByName('Canvas').addChild(node);
	
            
        }
    });
};

ui.yyyPanel = function () {
      cc.loader.loadRes("prefabs/yyyPrefab", (err, prefab)=>{
        if (!err) {
            var node = cc.instantiate(prefab);
			cc.director.getScene().getChildByName('Canvas').addChild(node);
	
            
        }
    });
};


module.exports = ui;