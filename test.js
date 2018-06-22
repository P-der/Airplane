console.log(screen.width);
var sWidth = screen.width;
var isPc = true;
if(sWidth<400){
    isPc = false
}
(function(isPc){
    var canvas = $("<canvas id='canvas' width='600' height='1000'></canvas>");
    var oButton = $('button').eq(0);
    var finished = false;
    var oWidth = canvas.get(0).width;
    var oHeight = canvas.get(0).height;
    var keydown = [];
    var enemys = [];
    var number = {
        type1:0,
        type2:0,
        type3:0
    };
    var score = 0;
    var oImg = $('img');

    //飞机对象
    var fly = {
        init:function(lift,speed,x,y,height,width){
            this.lift = lift;
            this.speed = speed;
            this.x = this.x||x||Math.random()*oWidth;
            this.y = this.y||y||0;
            this.width = width;
            this.height = height;
            this.bullet = [];
            this.active = true;
        },
        move:function(dx,dy,enemy){
            this.x = this.x + dx;
            this.y = this.y + dy;
            if((this.x+this.width)>oWidth){
                this.x = oWidth-this.width;
            }
            if(this.x<0){
                this.x = 0;
            }
            if((this.y+this.height)>oHeight){
                this.y = oHeight-this.height;
            }
            if(this.y<0){
                this.y = 0;
            }
        },
        draw:function(){
            if(this.active){
                ctx.beginPath();
                ctx.drawImage(oImg[2],this.x,this.y,50,50)
                ctx.closePath();
            }
        },
        addBullet:function(){
            var omove = this.move;
            var bullet = {
                x:this.x+this.width/2-6,
                y:this.y,
                dy:5,
                active:true,
                r:3,
                move:function(speed){
                    omove.call(this,0,speed);
                },
                draw:function(){
                    if(!this.active){
                        return;
                    }
                    ctx.beginPath();	
                    ctx.drawImage(oImg[0],this.x,this.y,12,20)
                    ctx.closePath();
                }
            }
            this.bullet.push(bullet);
        }
    }
    //玩家init
    var player = Object.create(fly);
    player.init(10,3,275,900,65,93);//lift,speed,x,y,height,width
    player.draw = function (){
        if(this.active){
            ctx.beginPath();
            ctx.drawImage(oImg[1],this.x,this.y,93,65)
            ctx.closePath();
        }
    }
    //敌机类型
    var type1 = Object.create(fly); //type1飞机 下飞的
    type1.name = 'type1';
    type1.move = function(){
        this.y += 5;
        if(this.y>oHeight){
            this.active = false;
        }
    }
    type1.addBullet = function(){
        var bullet = {
            x:this.x+this.width/2,
            y:this.y+this.height,
            active:true,
            r:3,
            move:function(){
                this.y += 10;
            },
            draw:function(){
                if(!this.active){
                    return;
                }
                ctx.beginPath();	
                ctx.fillStyle = '#000';
                ctx.arc(this.x, this.y, 3,0,Math.PI*2,true);
                ctx.fill();
                ctx.closePath();
            }
        }
        this.bullet.push(bullet);
    }
    var type2 = Object.create(fly); //type2飞机 左右飞的
    type2.name = 'type2';
    type2.move = function(){
        if(this.to == 'right'){
            this.x += 2;
        }else{
            this.x -= 2;
        }
        if(this.x<-(this.width)||this.x>oWidth){
            this.active = false;
        }
    }
    type2.addBullet = function(){
        var arr = [];
        var x = this.x+this.width/2;
        var y = this.y+this.height/2;
        for(let i = 0;i < 7;i++){
            arr[i] = {
                x,
                y,
                active:true,
                r:3,
                draw:function(){
                    if(!this.active){
                        return;
                    }
                    ctx.beginPath();	
                    ctx.fillStyle = '#000';
                    ctx.arc(this.x, this.y, 3,0,Math.PI*2,true);
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
        arr[0]['move'] = function(){
            this.x += 20;
        }
        arr[1]['move'] = function(){
            this.x += 16;
            this.y += 12;
        }
        arr[2]['move'] = function(){
            this.x += 12;
            this.y += 16;
        }
        arr[3]['move'] = function(){
            this.y += 20;
        }
        arr[4]['move'] = function(){
            this.x -= 12;
            this.y += 16;
        }
        arr[5]['move'] = function(){
            this.x -= 16;
            this.y += 12;
        }
        arr[6]['move'] = function(){
            this.x -= 20;
        }
        for(let i = 0;i < 7;i++){
            this.bullet.push(arr[i]);  
        }
    }
    var type3 = Object.create(type2); //type3飞机，弹道与type2不同
    type3.name = 'type3'
    type3.moveArr = [{x:5,y:0},{x:4,y:3},{x:3,y:4},{x:0,y:5},{x:-3,y:4},{x:-4,y:3},{x:-5,y:0}];
    type3.addBullet = function(){
        var x = this.x+this.width/2;
        var y = this.y+this.height/2;
        var arr = this.moveArr.slice(this.moveFlag,this.moveFlag+1)[0];
        enemy = {
                x,
                y,
                active:true,
                r:3,
                arr,
                draw:function(){
                    if(!this.active){
                        return;
                    }
                    ctx.beginPath();	
                    ctx.fillStyle = '#000';
                    ctx.arc(this.x, this.y, 3,0,Math.PI*2,true);
                    ctx.fill();
                    ctx.closePath();
                },
                move:function(){
                        this.x+= this.arr.x;
                        this.y+= this.arr.y;
                }
            }
        this.bullet.push(enemy); 
        this.moveFlag++;
        this.moveFlag %=6;  

    }
    //随机生成地图
    setInterval(function(){
        var flag = Math.random();
        var enemy = {};
        var type = null;
        if(flag<0.1){
            // enemy = Object.create(type2);
            // enemy.init(30,null,null,100,50,50);
            enemy = Math.random<0.5?Object.create(type2):Object.create(type3);
            enemy.moveFlag = 0;
            if(flag<0.05){
                enemy.to = 'right';
                enemy.x = 1;
            }else{
                enemy.to = 'left';
                enemy.x =  oWidth-50;
            }
            enemy.y = 100;
        }else{
            enemy = Object.create(type1);
            enemy.x = Math.floor(Math.random()*(oWidth-50));
            enemy.y = 1;
            // enemy.init(30,null,Math.floor(Math.random()*(oWidth-50)),1,50,50);
        }
        enemy.init(30,null,null,null,50,50);
        enemys.push(enemy);
    },1000)

    canvas.appendTo('#content');
    var ctx = canvas.get(0).getContext('2d');

    //按键监听 
    oButton.on('click',function(){
        location.reload();
    })
    if(isPc){
        for(var i=0; i<128; i++){
            keydown[i] = false;
        }
        $(document).keydown(function(e){
            keydown[e.which] = true;
        })
        $(document).keyup(function(e){
            keydown[e.which] = false;
        });
       
        function key(){
            if(keydown[37]){
                player.move(-10,0) 
            }
            if(keydown[38]){
                player.move(0,-4) 
            }
            if(keydown[39]){
                player.move(10,0) 
            }
            if(keydown[40]){
                player.move(0,4) 
            }
            if(keydown[32]){
            player.addBullet(1);
            }
        } 
    }else{
        $(document).on('touchstart',(e)=>{
            var clientX = Math.floor(e.changedTouches[0].clientX),
                clientY = Math.floor(e.changedTouches[0].clientY);
            // console.log(clientX,clientY)
            // var event =e||window.event;
			player.disX = clientX-player.x;
			player.disY = clientY-player.y;
			// console.log('a');
			// document.onmousemove =function (e){
			// 	var event = e||window.event;
			// 	demo.style.left = event.clientX - disX +'px';
			// 	demo.style.top = event.clientY - disY +'px';
			// 	console.log(demo.style.left);
			// };
			// document.onmouseup =function(e){
			// 	document.onmousemove = null;
			// 	document.onmouseup = null;
			// };

        }).on('touchmove',(e)=>{
            var clientX = Math.floor(e.changedTouches[0].clientX),
                clientY = Math.floor(e.changedTouches[0].clientY);
            player.x = clientX - player.disX<0?0:(clientX - player.disX>oWidth-player.width?oWidth-player.width:clientX - player.disX);
            player.y = clientY - player.disY<0?0:(clientY - player.disY>oHeight-player.height?oHeight-player.height:clientY - player.disY);
            console.log(clientX,clientY)
        })
    }
    

    function impact(foe){
        if(foe.active){
            if((player.x-foe.width <foe.x )&& (foe.x < player.x+player.width)&& (player.y-foe.height<foe.y)&& (player.y+player.height>foe.y)){
                finished = true;
            }//撞到player
            //foe减血
            player.bullet.forEach(function(bullet){
                if(bullet.active&&bullet.x>foe.x&&bullet.x<foe.x+foe.width&&bullet.y>foe.y&&bullet.y<foe.y+foe.height){
                    bullet.active=false;
                    foe.lift--;
                }
                if(foe.active&&foe.lift<=0){
                    foe.active = false;
                    number[foe.name]++;
                    // score[foe.name]
                    if(foe.name==='type1'){
                        score+=10;
                    }else if(foe.name==='type2'){
                        score+=15;
                    }else{
                        score+=20;
                    }
                }
            })
        }
        
        //player减血
        foe.bullet.forEach(function(bullet){
            if(bullet.active&&bullet.x>player.x&&bullet.x<player.width+player.x&&bullet.y>player.y&&bullet.y<player.y+player.height){
                bullet.active = false;
                player.lift--;
            }
            if(player.lift <= 0){
                finished = true;
            }
        })
    }

    function dataComputer(i){
        if(finished){
            clearInterval(timer);
            return;
        }
        if(isPc){
           key(); 
        }else{
            player.addBullet(1); 
        }
        player.bullet.forEach(function(item,index,arr){
            item.move(-20);
            if(item.y==(oHeight-this.height||0)){
                arr.splice(index,1);
            }
        })
        
        enemys.forEach(function(item,index,arr){
            impact(item);
            if(item.active){
                if(i){
                    item.addBullet();        
                }
                item.move();
            }
            item.bullet.forEach(function(item,index,arr){
                item.move();
                // if(item.y>oHeight){
                //     arr.splice(index,1)
                // }
            })        
            // if(item.y>oHeight||item.x>oWidth||item.x<(-item.width)){
            //     arr.splice(index,1);
            // } 
        }) 
    }

    function drwaAll(){
        if(finished){
            ctx.clearRect(0,0,oWidth,oHeight);
            var x = oWidth/2-50;
            var y = oHeight/2;   
            var cnumber = 0;
            for(prop in number){
                ctx.fillText(" 击杀 " + number[prop] + '架  ' + prop + "  敌机", x, y);
                y+=30;
                cnumber+=number[prop];
            }     
            ctx.fillText(" 总击杀 " + cnumber + "架敌机", x, y);
            y+=30;
            ctx.fillText(" 共计" + score + "分", x, y);        
            oButton.css({'display':'block'});
            return;
        }
        ctx.clearRect(0,0,oWidth,oHeight);
        ctx.font = 'italic normal 200 20px arial';
        ctx.fillText(" Score: " + score, 10, 20);
        ctx.fillText(" lift: " + player.lift, 10, 40);
        player.draw();
        player.bullet.forEach(function(item,index,arr){
            item.draw();
        })
        enemys.forEach(function(item,index,arr){
            item.bullet.forEach(function(item,index,arr){
                if(item.active){
                    item.draw();
                }
            })
            if(item.active){
                item.draw();
            }
        })
    }
    var i = 0;
    var timer = setInterval(function(){
        i++;
        if(i%10==0){
            dataComputer(true);
            i = 0;
        }else{
            dataComputer();
        }
        drwaAll();
    },16)
})(isPc)