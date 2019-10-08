var hongshi = require('NetConfig');

var netEngine = new Object();


netEngine.send = function (type, data, roomId, userId, callBack) {
    var ws = new WebSocket(hongshi.serverAddress);
    ws.onopen = function (msg) {
        var sendData = {
            "userId": userId,
		    "roomId": roomId,
            'type': type,
            "data": data,
        };
        if (hongshi.userData != null && hongshi.userData.id != null) {
            sendData.id = hongshi.userData.id;
        }
        var sendString = JSON.stringify(sendData);
        ws.send(sendString);
    };
    ws.onmessage = function(msg) {
        cc.log('net:receive:before: ' + msg.data);
        var data = JSON.parse(msg.data);
        if (data.type == type) {
            if (callBack != null) {
                callBack(data);
            }
           // ws.close();
        }
        else {
            cc.log('net:receive: ' + msg);
        }
    };
};

netEngine.register = function (type, data, callBack) {
    var ws = new WebSocket(hongshi.serverAddress);
    if (this.registeredList == null) {
        this.registeredList = {};
    }
    this.registeredList[type] = ws;
    ws.onopen = function (msg) {
        var sendData = {
            'type': type,
            data: data,
        };
        if (hongshi.userData != null && hongshi.userData.id != null) {
            sendData.id = hongshi.userData.id;
        }
        var sendString = JSON.stringify(sendData);
        ws.send(sendString);
    };
    ws.onmessage = function(msg) {
        cc.log('net:receive:before: ' + msg.data);
        var data = JSON.parse(msg.data);
        if (callBack != null) {
            callBack(data);
        }
    };
    ws.onclose = ()=>{
        this.registeredList[type] = null;
    };
};

netEngine.unRegister = function (type) {
    if (this.registeredList == null) return;
    if (this.registeredList[type] != null) {
        if (this.registeredList[type].readyState == WebSocket.OPEN)
            this.registeredList[type].close();
        this.registeredList[type] = null;
    }
}

netEngine.unRegisterAll = function () {
    if (this.registeredList == null) return;
    Object.keys(this.registeredList).forEach((type)=>{
        if (this.registeredList[type] != null) {
            if (this.registeredList[type].readyState == WebSocket.OPEN)
                this.registeredList[type].close();
            this.registeredList[type] = null;
        }
    });
}


module.exports = netEngine;