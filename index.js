function gEl(id){
    return document.getElementById(id);
}

function getCode(){
    return document.getElementById("input").value;
}

//Clicking run button
//Gets code and converts it 
let line = 1;
function run(){
    let rawCode = getCode();
    c = esprima.parse(rawCode);
    line = 1;
    gEl("output").value = convertAST(c);
    return convertAST(c)
}

//Main converting
//Loops trough each command and converts it
function convertAST(ast){
    let result = "";
    ast.body.forEach(el => {
        line++;
        //let i = 5
        if (el.type == "VariableDeclaration") {
            result += `set ${el.declarations[0].id.name} ${el.declarations[0].init.raw}\n`;
        }
        //i = 5 + foo
        else if (el.type == "ExpressionStatement" && el.expression.type == "AssignmentExpression") {
            result += `op ${getOperator(el.expression.right.operator,operatorsTable)} ${el.expression.left.name} ${getVal(el.expression.right.left)} ${getVal(el.expression.right.right)}\n`;
        }
        //draw(idk something)
        else if (el.type == "ExpressionStatement" && el.expression.type == "CallExpression"){
            result += handleCalls(el.expression)
        }
        //if (cond) { buhr}
        else if (el.type == "IfStatement"){
            //TODO: podminky udelat opacne
            result += `jump ${line + lenOfAST(el.consequent)} ${getOperator(el.test.operator,conditionalOperatorsTable)} ${getVal(el.test.left)} ${getVal(el.test.right)}\n`;
            result += convertAST(el.consequent)
        }
    });
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
            count += lenOfAST(el.consequent);
            //console.log(el.consequent)
            count++
        }else{
            count++
        }
    });
    return count;
}

//TODO: merge functions, generalise
function getOperator(symbol,table){
    //e.g. * => mul
    const result = table.find(el => el[0] == symbol);
    return result[1]
}/*
function getConditionalOperator(symbol){
    //e.g. < => lessThan
    const result = conditionalOperatorsTable.find(el => el[0] == symbol);
    return result[1]
}*/

//Converts calls into lines of masm
function handleCalls(fun){
    let args = ""
    let funName = fun.callee.name;
    fun.arguments.forEach(el => {
        args += getVal(el) + " "
    });
    //console.log(`${funName} ${args}\n`)
    return `${funName} ${args}\n`;
}

//Gets name or number depending on type
function getVal(obj){
    if (obj.type == "Identifier") {
        return obj.name;
    } else if (obj.type == "Literal") {
        return obj.raw;
    }
}
