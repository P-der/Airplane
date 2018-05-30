var canvas = $("<canvas id='canvas' width='600' height='1000'></canvas>");
var oButton = $('button').eq(0);
var finished = false;
var oWidth = canvas.get(0).width;
var oHeight = canvas.get(0).height;
var keydown = [];
var enemys = [];
var number = 0;
var score = 0;
var oImg = $('img');
var fly = {
    init:function(lift,speed,x,y,height,width){
        this.lift = lift;
        this.speed = speed;
        this.x = x||Math.random()*oWidth;
        this.y = y||0;
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
            // ctx.fillStyle = 'blue'
            // ctx.fillRect(this.x,this.y,this.width,this.height);
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
}//飞机对象
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

//敌机init
 var map = [{x:100,y:1,delay:3000,type:'type1'},{x:300,y:1,delay:3000,type:'type1'},
             {x:100,y:1,delay:6000,type:'type1'},{x:300,y:1,delay:6000,type:'type1'},
             {x:100,y:1,delay:9000,type:'type1'},{x:300,y:1,delay:9000,type:'type1'},
            {x:1,y:100,delay:12000,type:'type2',to:'right'},
            {x:100,y:1,delay:15000,type:'type1'},{x:300,y:1,delay:15000,type:'type1'},
             {x:100,y:1,delay:18000,type:'type1'},{x:300,y:1,delay:18000,type:'type1'},
             {x:100,y:1,delay:21000,type:'type1'},{x:300,y:1,delay:21000,type:'type1'},
            {x:oWidth-50,y:100,delay:24000,type:'type2',to:'left'}
        ];

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

map.forEach(function(item){
    var enemy = null;
    if(item['type']=='type1'){
        enemy = Object.create(type1);
    }else if(item['type']=='type2'){
        enemy = Object.create(type2);
        enemy.to = item.to;
    }
    enemy.init(30,null,item.x,item.y,50,50);
    cre(enemy,item['delay'])
})

function cre(item,delay,flag){   
    setTimeout(() => {
        enemys.push(item);
    },delay);
}
canvas.appendTo('#content');
var ctx = canvas.get(0).getContext('2d');



//按键监听
for(var i=0; i<128; i++){
    keydown[i] = false;
  }
$(document).keydown(function(e){
    keydown[e.which] = true;
})
$(document).keyup(function(e){
      keydown[e.which] = false;
});
oButton.on('click',function(){
    location.reload();
})


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

function impact(foe){
    if(foe.active){
        if((player.x-foe.width <foe.x )&& (foe.x < player.x+50)&& (player.y-foe.height<foe.y)&& (player.y+50>foe.y)){
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
                number++;
                score+=10;
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
    key();
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
        ctx.fillText(" 击杀 " + number + "敌机", 80, 120);
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
