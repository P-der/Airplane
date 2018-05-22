var canvas = $("<canvas id='canvas' width='600' height='1000'></canvas>");
var finished = false;
var oWidth = canvas.get(0).width;
var oHeight = canvas.get(0).height;
var keydown = [];
var enemys = [];
var number = 0;
var score = 0;
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
        if(!enemy&&(this.y+this.height)>oHeight){
            this.y = oHeight-this.height;
        }
        if(this.y<0){
            this.y = 0;
        }
    },
    draw:function(){
        if(this.active){
            ctx.beginPath();
            ctx.fillStyle = 'blue'
            ctx.fillRect(this.x,this.y,this.width,this.height);
            ctx.closePath();
        }
    },
    addBullet:function(num){
        var omove = this.move;
        var odraw = this.draw;
        var bullet = {
            x:this.x,
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
                ctx.fillStyle = '#000';
                ctx.arc(this.x, this.y, 3,0,Math.PI*2,true);
                ctx.fill();
                ctx.closePath();
            }
        }
        this.bullet.push(bullet);
    }
}//飞机对象
//玩家init
var player = Object.create(fly);
player.init(10,3,275,950,50,50);//lift,speed,x,y,height,width
//敌机init
var map = [{x:100,y:1,delay:3000},{x:300,y:1,delay:9000},
            {x:100,y:1,delay:9000},{x:300,y:1,delay:12000},
            {x:100,y:1,delay:15000},{x:300,y:1,delay:17000}
        ];
(function(map){
    map.forEach(function(item){
        var enemy = Object.create(fly);
        enemy.init(30,8,item.x,item.y,50,50);
        cre(enemy,item['delay'])
    })
})(map);
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
            console.log(player.lift)
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
        item.move(-10);
        if(item.y==(oHeight-this.height||0)){
            arr.splice(index,1);
        }
    })
    
    enemys.forEach(function(item,index,arr){
        impact(item);
        if(item.active){
            if(i){
                item.addBullet(1);        
            }
            item.move(0,5,true);
        }
        item.bullet.forEach(function(item,index,arr){
            item.move(10);
            if(item.y>oHeight){
                arr.splice(index,1)
            }
        })        
        if(item.y>oHeight){
            arr.splice(index,1);
        } 
    }) 
}

function drwaAll(){
    if(finished){
        ctx.clearRect(0,0,oWidth,oHeight);
        ctx.fillText(" 击杀 " + number + "敌机", 80, 120);
        return;
    }
    ctx.clearRect(0,0,oWidth,oHeight);
    ctx.fillStyle = "black";
    ctx.fillRect(player.x,player.y,50,50);
    ctx.fillStyle = "black";
    ctx.font = 'italic normal 200 20px arial';
    ctx.fillText(" Score: " + score, 10, 20);
    ctx.fillText(" lift: " + player.lift, 10, 40);
    player.draw();
    player.bullet.forEach(function(item,index,arr){
        item.draw();
    })
    enemys.forEach(function(item,index,arr){
        item.bullet.forEach(function(item,index,arr){
            item.draw();
        })
        item.draw();
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
