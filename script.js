var CREATUREIDcount = 0;

var creatureList = {};
var optionList = {};

function Creature( id ) {
    var interface = {
        getData : function () { return data; },
        useEnergy : function( v ) { data.energy-=v;},
        gainEnergy : function( v ) { data.energy+=v;},
        scuff : function( v ) { data.grooming-=v;},
        groom : function( v ) { Math.min(100, data.grooming+=v );},
        updateDomicoins : function( v) { console.log(data.domicoins);data.domicoins+=v; console.log(data.domicoins);}
    };

    var data = getData(id);

    function getData(id) {
        if ( (id == undefined) || (creatureList[id] == undefined))
            return newData()
        else
            return creatureList[id];
    }

    function newData() {
        var newdata=  {
            domicoins : 1,                              // personal coint of dominance coins
            desiredDominance : randExp(50, 100, 2,80),  // level of dominance that this creates desires
            energy : randExp(50, 100, 2,80),            // energy reserves used to perform activities, replenished by eating
            grooming : randExp(50, 100, 1,80),          // personal hygene levels. from looking good down to clean but ordernery, to disheveled, to scraggly, matted, parasite enfested, deased.
            size : randExp(5, 10, 3,5),                 // is a proxy for strength
            skill : randExp(0, 3, 1,1),                // the ability yo use the maximum amount of its strength/size in fight
            id : CREATUREIDcount++
        }

        creatureList[newdata.id] = newdata;

        return newdata;
    }

    return interface;
}
/*
function viewLists() {
    for (var k in creatureList) {
        console.log(""+k+" > "+JSON.stringify( creatureList[k]) );
    }
}
/**/


function Interaction( cA, cB ) {
    var interface = {
        update : update,
    };

	var creatureA = new Creature(cA);
	var creatureB = new Creature(cB);

    var aState = "passive";
    var bState = "passive";

    log(""+cA+" approaches "+cB);


    function update() {

        switch (aState+" "+bState) {
            case "passive passive" :
                var bOptions = ["aggressive","submissive"];
                bState = bOptions[coinFlip()];
                if (bState == "aggressive") {
                    log(cB+" growls and bares teath.");
                    creatureB.useEnergy(2);
                }
                else {
                    log(cB+" cowers and presents belly.");
                }
                break;
            case "passive aggressive" :
                var aOptions = ["aggressive","submissive"];
                aState = aOptions[coinFlip()];
                if (aState == "aggressive") {
                    log(cA+" puffs up and growls back.");
                    creatureA.useEnergy(2);
                }
                else {
                    log(cA+" rolls over and presents belly.");
                }
                break;
            case "passive submissive" :
                var aOptions = ["aggressive","submissive"];
                aState = aOptions[coinFlip()];
                if (aState == "aggressive") {
                    log(cA+"  growls and bares teath.");
                    creatureA.useEnergy(2);
                }
                else {
                    log(cA+" softens stance and drops down too.");
                }
                break;
            case "aggressive aggressive" :
                var bOptions = ["aggressive","submissive"];
                bState = bOptions[coinFlip()];
                if (bState == "aggressive") {
                    log(cB+" does not back down.");
                    log("a fight breaks out");

                    fight(cA,cB,0,0);

                    aState = "leave";
                    bState = "leave";
                }
                else {
                    log(cB+" backs down, and loses dominance.");
                    log(cA+" has another chance to make a move.");
                    // A has another change
                    creatureA.updateDomicoins(-1);
                    creatureB.updateDomicoins(1);
                }
                break;
            case "submissive aggressive" :
                var bOptions = ["aggressive","submissive"];
                bState = bOptions[coinFlip()];
                if (bState == "aggressive") {
                    log(cB+" takes the advantage and attacks "+cA);
                    log("a fight ensues");
                    fight(cA,cB,1,-1);
                }
                else {
                    log(cB+" backs down and starts to groom "+cA);
                    creatureB.useEnergy(1);
                    creatureA.groom(10);
                }
                aState = "leave";
                bState = "leave";
                break;
            case "aggressive submissive" :
                var aOptions = ["aggressive","submissive"];
                aState = aOptions[coinFlip()];
                if (bState == "aggressive") {
                    log(cA+" takes the advantage and attacks "+cB);
                    log("a fight ensues");
                    fight(cA,cB,1,-1);
                }
                else {
                    log(cA+" backs down and starts to groom "+cB);
                    creatureA.useEnergy(1);
                    creatureB.groom(10);
                }
                aState = "leave";
                bState = "leave";
                break;
            case "submissive submissive" :
                log(cA+" grooms "+cB);
                creatureA.useEnergy(1);
                creatureB.groom(10);
                aState = "leave";
                bState = "leave";
                break;
                /*
            case "passive submissive" :
                break;
            case "passive submissive" :
                break;
            case "passive submissive" :
                break;
            case "passive submissive" :
                break;
    /**/
            default :
                log("The End.");
                break;
        }
    }

    return interface;
}

function fight( cA, cB, aPenalty, bPenalty) {
    var a = new Creature(cA);
    var b = new Creature(cB);
console.log(a.getData().id+" "+cA)
console.log(b.getData().id+" "+cB)
    a.useEnergy(10);
    b.useEnergy(10);

    var aData = a.getData();
    var bData = b.getData();

    var aRoll = randExp(0,aData.size,aData.skill-aPenalty,aData.size)
    var bRoll = randExp(0,bData.size,aData.skill-aPenalty,bData.size)

    if (aRoll > bRoll) {
        log(cA+" wins ");
        a.updateDomicoins(1);
        b.updateDomicoins(-1);
        b.scuff((aRoll-bRoll)*5);
        a.scuff(5);
    } else if (bRoll > aRoll) {
        log(cB+" wins ");
        b.updateDomicoins(1);
        a.updateDomicoins(-1);
        a.scuff((bRoll-aRoll)*5);
        b.scuff(5);
    } else {
        log("its a stailmate."+cB);
        a.scuff(10);
        b.scuff(10);
    }
}

function Opinion( cA, cB  ) {

    var interface = {
        getData : function () { return data; }
    };

    data = getData();

    function getListIndex() { return ""+cA+"|"+cB; }

    function getData() {
        var d = optionList[getListIndex()];

        if (d == undefined)
            d =  newData()

        return d;
    }

    function newData() {
        var newdata=  {
            BDomicoins : 1,     // A's count of of B's dominance coins
            ALoveForB : 0       // A's love for B
        }

        optionList[getListIndex()] = newdata;

        return newdata;
    }

    return interface;
}

function CreatureView() {
    var interface = {
        update : update
    }

    function update() {
        var elem;

        for (var k in creatureList) {
            //console.log(""+k+" > "+JSON.stringify( creatureList[k]) );
            elem = $("#creatureList > #cr"+k);

            if (elem.length == 0) {
                $("#creatureList").append("<div id='cr"+k+"'></div>");
                elem = $("#creatureList > #cr"+k);
            }

            elem.html(""+k+" > "+JSON.stringify( creatureList[k]));
        }
    }

    return interface;
}

function log( msg ) {
    $("#log").append("<div>"+msg+"</div>");
}

function randExp(from, to, exp, center) {
    if (center== undefined)
        center =0;

    x = (Math.random()*(to-from)+from-center);

    for (var j=0;j<exp;j++)
        x*=Math.random();

    return Math.round(x+center);
}

function coinFlip() {
    return Math.round(Math.random());
}

var cv;
var interaction;
function start() {

    cv = new CreatureView()

    for (var i=0;i<5; i++) {
        var cr = new Creature();
        log("new creature "+i+"/20");
    }

    cv.update();

    interaction = new Interaction(1,2);
    cv.update();
    //interaction.update();

}



function update() {
    interaction.update();
    cv.update();
}


function testDist( n, f, t, s, center) {
    var from = f;
    var to = t;

    var dist = [];
    var x;
    //var bottom = Math.round(w/2)
    for (var i=from-1;i<=to+1;i++) {
        dist[i] = 0;
    }

    for (var i=0;i<n;i++) {

        x = randExp(from,to,s,center);

        dist[x] ++;
    }

    var max = 0;
    for (var i=from-1;i<=to+1;i++) {
        if (dist[i] > max) max = dist[i];

        //console.log(" "+(i-bottom)+"\t\t"+dist[i]);
    }

   for (var i=from-1;i<=to+1;i++) {
        var bar = "";
        var rel = 40/max*dist[i];
        for (var j=0;j<rel;j++)
            bar = "#"+bar;

        console.log(" "+(i)+"\t\t\t\t"+bar+" ("+dist[i]+")");
    }
}
