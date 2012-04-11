/**
 * 用于ppt播放进度远程控制
 * 
 */

/*******************************引入模块************************************************************/
var express = require('express'),
    sio = require('socket.io'),
    fs = require('fs'),
    path = require('path'),
    url = require('url'),
    parseCookie = require('connect').utils.parseCookie,
    storeMemory = new express.session.MemoryStore();

/*******************************express配置********************************************************/
var app = module.export = express.createServer();

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
		secret: 'wyq',
		store: storeMemory
	}));
    app.use(express.methodOverride());
    app.use(app.router);//要放在bodyParser之后，处理post
    app.use(express.static(__dirname + '/static'));
});


/*************************************websocket ctrl***********************************************/
var WS = {}, ctrlWS = {}, ctrlUserWS = {};
var io = sio.listen(app);
var ctrlSocket = io.of('/ctrl').on('connection',function(socket){
    var session = socket.handshake.session;//session
    var pptid = (session && session.ctrlPPTID) || 0;
	if(pptid){
		
		console.log('======================>',pptid);
		
		ctrlWS[pptid] && delete ctrlWS[pptid];
		ctrlWS[pptid] = socket;
	}
	socket.on('ctrl users',function(data){
        console.log(data);
		ctrlUserWS[pptid] = data.uids; 
    });
	
    socket.on('ctrl ppt action',function(data){
		console.log('ctrl ppt action=============>',data);
		console.log('ctrl ppt action=============>',ctrlUserWS[pptid]);
		
		if(ctrlUserWS[pptid]){
			ctrlUserWS[pptid].forEach(function(id){
				console.log(WS[pptid+id]);
				WS[pptid+id].emit('ppt do',data);
			});
		}
//		return;
//        WS[pptid] && WS[pptid].emit('ppt do',data);
//        console.log(data);
    });
	
		
});

/*******************************通过router的json来控制ppt*******************************************/
//通过router的json来控制ppt，访问url示例：a.ppt

var routes = require('./router.json');
var _userID = 0;//ppt观看者用户编号

var readPPT = function(r,tmp, req, res){
	var template = tmp.template;
	
	
	
	
	var realpath = __dirname + '/ppt/' + url.parse(template).pathname;
	if (path.existsSync(realpath)) {
		var txt = fs.readFileSync(realpath);
		res.end(txt);
	}
	else {
		res.end('404' + realpath);
		return 'Error 404: not found '+realpath;
	}
}

//ppt页面
for(var r in routes){
    
    io.of(r).on('connection',function(socket){
		var session = socket.handshake.session,
		  uid = session.uid;
		
        var wsIndex = r + uid;
        WS[wsIndex] && delete WS[wsIndex];
        WS[wsIndex] = socket;
        
        socket.on('user exit', function(){
        
            ctrlWS[r] && ctrlWS[r].emit('user exit', {
                uid: session.uid,
                uname: session.uname,
                pptid: r
            });
        });
        
        ctrlWS[r] && ctrlWS[r].emit('user connect', {
            uid: session.uid,
            uname: session.uname,
            pptid: r
        });
    });
	
    app.get(r,function(r,tmp){
        return function(req,res){
			var session = req.session;
			if(session.pptID && session.pptID!==''){
				
				readPPT(r,tmp,req,res);
			}else{
				//读取登录页面，要求登录
		        var realpath = __dirname + '/views/' + url.parse('pptlogin.html').pathname;
		        var txt = fs.readFileSync(realpath);
		        res.end(txt);
			}
			
        }
    }(r,routes[r]));
	
	app.post(r,function(r,tmp){
		return function(req, res){
			var name = req.body.name,
				password = req.body.password;

			if (name && name !== '' && password === tmp.password) {
				var session = req.session;
				session.uname = name;//设置session
				session.uid = _userID++;
				session.pptID = r;
				
				readPPT(r,tmp, req, res);
			}
			else {
				res.end('Error: authorization');
			}
		}
	}(r,routes[r]));
}

/*******************************首页，列出list******************************************************/
//
app.get('/', function(req, res){
	var session = req.session;
	if (session.pptID) {
		res.send('你已经访问了一个ppt文件，是否继续访问？<a href="' + session.pptID + '">继续</a>');
	}
	if (session.ctrlPPTID) {
		res.send('你已经<span style="color:red">控制</span>了一个ppt文件，是否继续访问？<a href="' +session.ctrlPPTID + '">继续</a>');
	}
	
	fs.readFile(__dirname + '/index.html', function(err, data){
		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		}
		
		//res.writeHead(200);
		res.end(data);
	});
});


/*******************************控制页面************************************************************/
var ctrlRead = function(req, res){
	fs.readFile(__dirname + '/ctrl.html', function(err, data){
		if (err) {
			res.writeHead(500);
			return res.end('Error loading ctrl.html');
		}
		
		res.end(data);
	});
}

//提交控制页面
app.get('/ctrl', function(req, res){
	if (req.session.ctrlPPTID && req.session.ctrlPPTID !== '') {
		ctrlRead(req, res);
	}
	else {
	   //读取登录页面，要求登录
        var realpath = __dirname + '/views/' + url.parse('login.html').pathname;
        var txt = fs.readFileSync(realpath);
        res.end(txt);
	}
	
});
app.post('/ctrl',function(req,res){
    var pptid = req.body.pptid,
    	password = req.body.password;
    pptid = pptid.indexOf('/')===0?pptid:('/'+pptid);
    var route = routes[pptid];

    if(pptid && pptid!=='' && route.password === password){
        req.session.ctrlPPTID = pptid;//设置session
        
        ctrlRead(req, res);
    }else{
        res.end('Error: authorization');
    }
});

/*******************************SOCKET authorization***********************************************/

//socket处理session
io.set('authorization', function(handshakeData, callback){
    // 通过客户端的cookie字符串来获取其session数据
    handshakeData.cookie = parseCookie(handshakeData.headers.cookie);
    var connect_sid = handshakeData.cookie['connect.sid'];
    
    if (connect_sid) {
        storeMemory.get(connect_sid, function(error, session){
            if (error) {
                // if we cannot grab a session, turn down the connection
                callback(error.message, false);
            }
            else {
                // save the session data and accept the connection
                handshakeData.session = session;
                callback(null, true);
            }
        });
    }
    else {
        callback('nosession');
    }
});

/*******************************开始app************************************************************/
app.listen(3000, function(){
    var addr = app.address();
    console.log('app listening on http://127.0.0.1：' + addr.port);
});