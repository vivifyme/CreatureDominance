var CREATUREIDcount = 0;

var creatureList = {};
var optionList = {};

function Creature( d ) {
    var interface = {
        getData : function () { return data; }
    };

    data = getData();

    function getData() {
        if (d == undefined)
            return newData()
        else
            return d;
    }

    function newData() {
        var newdata=  {
            grooming : Math.round(Math.random()*50)+50,
            strength : Math.round(Math.random()*5)+5,
            id : CREATUREIDcount++
        }

        creatureList[newdata.id] = newdata;

        return newdata;
    }

    return interface;
}

function viewLists() {
    for (var k in creatureList) {
        console.log(""+k+" > "+JSON.stringify( creatureList[k]) );
    }
}


function Interaction( cA, cB ) {
    var interface = {
        update : update,
    };

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
                    aState = "leave";
                    bState = "leave";
                }
                else {
                    log(cB+" backs down, and loses dominance.");
                    log(cA+" has another chance to make a move.");
                    // A has another change
                }
                break;
            case "submissive aggressive" :
                var bOptions = ["aggressive","submissive"];
                bState = bOptions[coinFlip()];
                if (bState == "aggressive") {
                    log(cB+" takes the advantage and attacks "+cA);
                    log("a fight ensues");
                }
                else {
                    log(cB+" backs down and starts to groom "+cA);
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
                }
                else {
                    log(cA+" backs down and starts to groom "+cB);
                }
                aState = "leave";
                bState = "leave";
                break;
            case "submissive submissive" :
                log(cA+" grooms "+cB);
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
            dominance : 1,
            loyalty : 0
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

function coinFlip() {
    return Math.round(Math.random());
}

function start() {

    var cv = new CreatureView()

    for (var i=0;i<20; i++) {
        var cr = new Creature();
        log("new creature "+i+"/20");
    }

    cv.update();

}
