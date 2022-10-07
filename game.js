title = "Orbit";

description = `[Hold] to accelerate
[Release] to decay
`;

characters = [
`
c ll c
ccllcc
ccllcc
ccllcc
cc  cc
c    c
`,
`
cccccc
 cccc 
  llll
  llll
 cccc 
cccccc
`,
`
c    c
cc  cc
ccllcc
ccllcc
ccllcc
c ll c
`,
`
cccccc
 cccc 
llll
llll
 cccc 
cccccc
`,
`
 bbbb 
bgggbb
bbggbb
bggbbb
bbbbgg
 bbbb 
`
];

const G ={
   WIDTH: 150,
   HEIGHT: 150, 
   STARTVEL: 60 ,
   GRAV: 1000,
   BLEED: 0.999,
   ACCEL: 1.002,
   PLANRAD: 5,
   OUTOFBOUNDS: 106 //circle through corner
};

player = {
    pos: vec(G.WIDTH/2,G.HEIGHT/3), //start position
    vel: vec(G.STARTVEL,0),         //start velocity
    toPlan: vec(0,0),               //used for calculations
    distToPlan: 1                   //used for calculations
}

target = {
    pos: vec(0,0)
}

function randPoint(){
    point = vec(0,0)
    theta = Math.random()*2*PI 
    L = Math.random() * 60 + G.PLANRAD + 3
    point.x = Math.cos(theta) * L + G.WIDTH/2
    point.y = Math.sin(theta) * L + G.HEIGHT/2
    return point;
}

options = {
    viewSize: {x: G.WIDTH, y:G.HEIGHT},
    theme: "dark"
};

function update() {
    if (!ticks) {
        //initialize player LOCATION AND VELOCITY
        player.pos.x = G.WIDTH/2
        player.pos.y = G.HEIGHT/3
        player.vel.x = G.STARTVEL
        player.vel.y = 0
        target.pos = randPoint()
    }

    //accelerate or decelerate as necessasary
    if(input.isPressed){
        //raise velocity
        player.vel.x = player.vel.x * G.ACCEL
        player.vel.y = player.vel.y * G.ACCEL
    }
    else{
        //bleed velocity
        player.vel.x = player.vel.x * G.BLEED
        player.vel.y = player.vel.y * G.BLEED
    }

    //update player position
    player.pos.x = (player.pos.x + 0.01 * player.vel.x)
    player.pos.y = (player.pos.y + 0.01 * player.vel.y)
    
    //update direction and distance to planet
    player.toPlan.x = G.WIDTH/2 - player.pos.x
    player.toPlan.y = G.HEIGHT/2 - player.pos.y
    player.distToPlan = sqrt(player.toPlan.x ** 2 + player.toPlan.y ** 2)
    player.toPlan.x = (player.toPlan.x/player.distToPlan)
    player.toPlan.y = (player.toPlan.y/player.distToPlan)

    //velocity
    player.vel.x = (G.GRAV/ (player.distToPlan ** 2)) * player.toPlan.x + player.vel.x
    player.vel.y = (G.GRAV/ (player.distToPlan ** 2)) * player.toPlan.y + player.vel.y

    if(player.distToPlan < G.PLANRAD || player.distToPlan > G.OUTOFBOUNDS){
        end()
    }


    //render target
    color("yellow")
    box(target.pos, 3)
    color("black")


    //render player facing direction of greatest velocity
    if(abs(player.vel.y)>abs(player.vel.x)){
        if(player.vel.y>0){
            isCol = char("c",player.pos).isColliding.rect;
        }
        else{
            isCol = char("a",player.pos).isColliding.rect;
        }
    }
    else{
        if(player.vel.x>0){
            isCol = char("b",player.pos).isColliding.rect;
        }
        else{
            isCol = char("d",player.pos).isColliding.rect;
        }
    }
    //render planet
    char("e",vec(G.WIDTH/2,G.HEIGHT/2));


    if(isCol.yellow){
       score+=1
       target.pos = randPoint() 
    }

}

addEventListener("load", onLoad);