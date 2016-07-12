/*jslint white: true*/
var CREATUREIDcount = 0;

var creatureList = {};
var optionList = {};

function Creature( d ) {
    "use strict";
    var data = getData(d);

    var interf = {
        getData : function () { return data; },
        useEnergy : function( v ) { data.energy-=v;},
        gainEnergy : function( v ) { data.energy+=v;},
        scuff : function( v ) { data.grooming-=v;},
        groom : function( v ) { Math.min(100, data.grooming+=v );},
        updateDomicoins : function( v) { data.domicoins+=v; }
    };

    function getData(d) {
        if (typeof(d) == "object") {
            var newdata = newData()

            for (var k in d) {
                newdata[k] = d[k];
            }

            return newdata;
        }
        else if ( (d == undefined) || (creatureList[d] == undefined))
            return newData()
        else
            return creatureList[d];
    }

    function newData() {
        var newdata=  {
            domicoins : 1,                              // personal coint of dominance coins
            desiredDominance : randExp(50, 100, 2,80),  // level of dominance that this creates desires
            energy : randExp(50, 100, 2,80),            // energy reserves used to perform activities, replenished by eating
            grooming : randExp(50, 100, 1,80),          // personal hygene levels. from looking good down to clean but ordernery, to disheveled, to scraggly, matted, parasite enfested, deased.
            size : randExp(20, 30, 3,20),                // is a proxy for strength
            skill : randExp(0, 3, 1,1),                // the ability yo use the maximum amount of its strength/size in fight
            id : CREATUREIDcount++
        }

        creatureList[newdata.id] = newdata;

        return newdata;
    }

    return interf;
}
/*
function viewLists() {
    for (var k in creatureList) {
        console.log(""+k+" > "+JSON.stringify( creatureList[k]) );
    }
}
/**/


function Interaction( cA, cB ) {
    var interf = {
        update : update,
    };

	var creatureA = new Creature(cA);
	var creatureB = new Creature(cB);

    var aState = "passive";
    var bState = "passive";

    log(""+cA+" approaches "+cB);


    function update() {

        var ret = false;

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
                ret = true;
        }

        return ret;
    }

    return interf;
}

function chooseWaited() {

}

function getBrawlOdds( aSize, aSkill, bSize, bSkill ) {
    if (aSkill < 0) aSkill=0;
    if (bSkill < 0) bSkill=0;

    aSkill*=4;
    bSkill*=4;

    var aChance = aSize+aSize*aSkill + (aSize>bSize?aSize/bSize*10:0)*aSkill;
    var bChance = bSize+bSize*bSkill + (bSize>aSize?bSize/aSize*10:0)*bSkill;
    var total = aChance + bChance;
    var dChance =  Math.floor(total*5/100*(Math.max(aSkill,bSkill)-Math.abs(aSkill-bSkill)));
    total += dChance;

    return {
        1:Math.floor(aChance/total*100),
        2:Math.floor(bChance/total*100),
        0:Math.floor(dChance/total*100)
    };
}

function brawl( aSize, aSkill, bSize, bSkill ) {
    return ROT.RNG.getWeightedValue( getBrawlOdds(aSize, aSkill, bSize, bSkill) );
}

function fight( cA, cB, aPenalty, bPenalty) {
    var a = new Creature(cA);
    var b = new Creature(cB);

    a.useEnergy(10);
    b.useEnergy(10);

    var aData = a.getData();
    var bData = b.getData();
    /*
    var aRoll = randExp(0,aData.size,aData.skill-aPenalty,aData.size+aData.skill)
    var bRoll = randExp(0,bData.size,bData.skill-bPenalty,bData.size+bData.skill)
    /**/
    var ret = brawl(aData.size,aData.skill-aPenalty,bData.size,bData.skill-bPenalty);

    switch (ret) {
        case "1":
            log(cA+" wins ");
            a.updateDomicoins(1);
            b.updateDomicoins(-1);
            b.scuff(15);
            a.scuff(5);
            break;

        case "2":
            log(cB+" wins ");
            b.updateDomicoins(1);
            a.updateDomicoins(-1);
            a.scuff(15);
            b.scuff(5);
            break;
        case "0":
            log("its a stailmate."+cB);
            a.scuff(10);
            b.scuff(10);
            ret = 0;
            break;
    }

    return ret;
}

function Opinion( cA, cB  ) {

    var interf = {
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

    return interf;
}

function CreatureView() {
    var interf = {
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

    return interf;
}

function log( msg ) {
    $("#log").append("<div>"+msg+"</div>");
}


var USEROT = true;
function random() {
	if (USEROT)
		return ROT.RNG.getUniform();
	else
		return Math.random();
}


function randExp(from, to, exp, center) {
    if (center== undefined)
        center =0;

    x = (random()*(to+1-from)+from-center);

    for (var j=0;j<exp;j++)
        x*=random();

    return Math.floor(x+center);
}

function coinFlip() {
    return Math.round(random());
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


function testFight( aSize, aSkill, bSize, bSkill, n ) {
    var creatureA = new Creature({size:aSize,skill:aSkill});
    var creatureB = new Creature({size:bSize,skill:bSkill});

    var scores = {0:0, 1:0,2:0};

    for (var i=0;i<n;i++) {
        scores[fight(creatureA.getData().id, creatureB.getData().id, 0, 0 )]++;
    }

    var odds = getBrawlOdds( aSize, aSkill, bSize, bSkill );

    scores[0] = Math.floor(scores[0]/n*100);
    scores[1] = Math.floor(scores[1]/n*100);
    scores[2] = Math.floor(scores[2]/n*100);

    console.log("A: "+("# "+scores[1]).lpad("#",5+scores[1]/2).rpad(" ",50)+("# "+odds[1]).lpad("#",5+odds[1]/2).rpad(" ",40) );
    console.log("B: "+("# "+scores[2]).lpad("#",5+scores[2]/2).rpad(" ",50)+("# "+odds[2]).lpad("#",5+odds[2]/2).rpad(" ",40) );
    console.log("=: "+("# "+scores[0]).lpad("#",5+scores[0]/2).rpad(" ",50)+("# "+odds[0]).lpad("#",5+odds[0]/2).rpad(" ",40) );

}

