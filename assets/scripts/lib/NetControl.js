/**
 * Created by Administrator on 2018/4/17 0017.
 */
//����ȫ�ֵı���
var netConfig=require('NetConfig');
var NetControl={
    _sock:{},  //��ǰ��webSocket�Ķ���
    _callBack:null,
    connect: function () {
        if(this._sock.readyState!==1){
            //��ǰ�ӿ�û�д�
            //��������
            this._sock = new WebSocket(netConfig.serverAddress);
            this._sock.onopen = this._onOpen.bind(this);
            this._sock.onclose = this._onClose.bind(this);
            this._sock.onmessage = this._onMessage.bind(this);
			this._sock.onerror = this._onError.bind(this);
        }
        return this;
    },
    _onOpen:function(){
		 heartCheck.start();
    },
    _onClose:function(err){
		cc.log('net:webscoket:close: ' + err);
		setTimeout(function () {
			cc.log('reconnet:net:webscoket:close: ' + err);
               NetControl.connect();
            }, 10000);
    },
    _onMessage:function(msg){
		heartCheck.reset();
		cc.log('net:receive:before: ' + msg.data);
		if(this._callBack != null){
			 this._callBack(msg);
		}
        
    },
	_onError:function(msg){
		cc.log("connet:error");
	},

    send:function(type, data){
	    this.connect();
		var sendData = {
            "userId": netConfig.userData.userId,
		    "roomId": netConfig.userData.roomId,
			"tokenId": cc.sys.localStorage.getItem("tokenid"),
            'type': type,
            "data": data,
        };
		var sendString = JSON.stringify(sendData);
		//���״̬�жϣ���ΪOPENʱ��������Ϣ
		if (this._sock.readyState===1) {
			 this._sock.send(sendString);
			 console.log("send msg:"+sendString);
		}
       
        
    },

};

module.exports=NetControl;




var heartCheck = {
    timeout: 4000,//15s
    timeoutObj: null,
    reset: function(){
        clearTimeout(this.timeoutObj);
　　　　 this.start();
    },
    start: function(){
        this.timeoutObj = setTimeout(function(){
           NetControl.send('heartbeat','');
        }, this.timeout)
    }
}