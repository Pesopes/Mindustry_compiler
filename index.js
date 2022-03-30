function gEl(id){
    return document.getElementById(id);
}

function getCode(){
    return document.getElementById("input").value;
}

function copyText(id){
    let text = gEl(id)
    text.select()
    navigator.clipboard.writeText(text.value)
}

//TODO: fix the bugs lol.

//Clicking run button
//Gets code and converts it 
let line = 1;
function run(){
    let rawCode = getCode();
    let c = esprima.parse(rawCode);
    line = 1;
    //you can see where in the input it failed
    let out = "ERROR"
    try {
        out = convertAST(c, true)
    } catch (error) {
       console.log("line: "+ line+" err: " + error.name +" mess: " + error.message) 
    }

    gEl("output").value = out;
    return out
}

//Main converting
//Loops trough each command and converts it
function convertAST(ast, firstCall = false){
    let result = "";
    if (firstCall) {
        result += firstConversion(ast)
        console.log(line)
    }
    ast.body.forEach(el => {
        line++;
        //let i = 5
        //TODO: you have to always type "let" if you are assigning a value to a variable (maybe get rid of the let entirely like python)
        //OKAY I KNOW let will be made at the top and fire only once
        /*if (el.type == "VariableDeclaration") {
            result += `set ${el.declarations[0].id.name} ${el.declarations[0].init.raw}\n`;
        }*/
        //i = 5 + foo
        if (el.type == "ExpressionStatement" && el.expression.type == "AssignmentExpression") {
            if (el.expression.right.type == "BinaryExpression") {
                result += `op ${getOperator(el.expression.right.operator,operatorsTable)} ${el.expression.left.name} ${getVal(el.expression.right.left)} ${getVal(el.expression.right.right)}\n`;
            }else{
                result += `set ${getVal(el.expression.left)} ${getVal(el.expression.right)}\n`;
            }
        }
        //draw(idk something)
        else if (el.type == "ExpressionStatement" && el.expression.type == "CallExpression"){
            result += handleCalls(el.expression)
        }
        //if (cond) { buhr}
        //TODO: add else ifs, while loops
        else if (el.type == "IfStatement"){
            if (el.test.type == "BinaryExpression") {
                result += `jump ${line + lenOfAST(el.consequent)-1} ${getOppositeCondition(getOperator(getVal(el.test),conditionalOperatorsTable))} ${getVal(el.test.left)} ${getVal(el.test.right)}\n`;
            }else if (el.test.type == "Literal"){
                result += `jump ${line + lenOfAST(el.consequent)-1} ${getOperator(getVal(el.test),conditionalOperatorsTable)}\n`;
            }
            result += convertAST(el.consequent)
            if (el.alternate != null) {
                if (el.test.type == "BinaryExpression") {
                    result += `jump ${line + lenOfAST(el.alternate)-1} ${getOperator(getVal(el.test),conditionalOperatorsTable)} ${getVal(el.test.left)} ${getVal(el.test.right)}\n`;
                }else if (el.test.type == "Literal"){
                    result += `jump ${line + lenOfAST(el.alternate)-1} ${getOperator(getVal(el.test),conditionalOperatorsTable)}\n`;
                }
                result += convertAST(el.alternate)
            }
        }
        //TODO: add functions (some var at top so you can get back, all functions at top with an always jump at start)
    });
    return result
}

function firstConversion(ast){
    let result = "";
    let inits = ""
    let found = false
    ast.body.forEach(el => {
        if (el.type == "VariableDeclaration") {
            inits += `set ${el.declarations[0].id.name} ${el.declarations[0].init.raw}\n`;
            found = true
            line++
        }

    });
    const initVariableName = "initVariable"
    if (found) {        
        line += 2
        result += `jump ${line - 1} notEqual ${initVariableName} null\n`
        result += `set ${initVariableName} true\n`
        result += inits
    }
    return result
}

//Parses code trough esprima
function getAST(){
    return esprima.parse(getCode())
}

//Returns length of code even in nested, ooh recursive
function lenOfAST(ast){
    let count = 0;
    ast.body.forEach(el => {
        if (el.type == "IfStatement"){
            if (el.alternate != null){
                count += lenOfAST(el.alternate);
                count++
            }
            count += lenOfAST(el.consequent);
            //console.log(el.consequent)
            count++
        }else{
            count++
        }
    });
    return count;
}

//gets operator from table in consts.js
function getOperator(symbol,table){
    //e.g. * => mul
    const result = table.find(el => el[0] == symbol);
    return result[1]
}

function getOppositeCondition(symbol){
    //e.g. equal => notEqual
    const result = oppositeConditionsTable.find(el => el[0] == symbol);
    return result[1]
}

//Converts calls into lines of masm
function handleCalls(fun){
    let args = ""
    const funName = fun.callee.name;
    fun.arguments.forEach(el => {
        args += getVal(el) + " "
    });
    //TODO: these special calls(sin) will be written as "foo = sin(2)"
    const result = operatorsTable.find(el => el[1] == funName);
    if (result != null) {
        return `op ${funName} ${args}\n`;
    }else{
        return `${funName} ${args}\n`;
    }
}

//Gets name or number depending on type
function getVal(obj){
    if (obj.type == "Identifier") {
        //you cant have @ in var name so you use $ instead
        return obj.name.replace("$","@");
    } else if (obj.type == "Literal") {
        return obj.raw;
    }else if (obj.type == "BinaryExpression") {
        return obj.operator;
    }
}
