function convertCommand(el) {
    line++;
    let result = "";
    //i = 5 + foo
    if (el.type == "ExpressionStatement" && el.expression.type == "AssignmentExpression") {
        if (el.expression.right.type == "BinaryExpression") {
            result += `op ${getOperator(el.expression.right.operator, operatorsTable)} ${el.expression.left.name} ${getVal(el.expression.right.left)} ${getVal(el.expression.right.right)}\n`;
        } else {
            result += `set ${getVal(el.expression.left)} ${getVal(el.expression.right)}\n`;
        }
    }

    //draw(idk something)
    else if (el.type == "ExpressionStatement" && el.expression.type == "CallExpression") {
        result += handleCalls(el.expression);
    } else if (el.type == "VariableDeclaration") {
        line -= 1; //because let is already pre calculated 
    }


    //if (cond) { buhr}
    //TODO: add else ifs, while loops
    else if (el.type == "IfStatement") {
        if (el.test.type == "BinaryExpression") {
            result += `jump ${line + lenOfAST(el.consequent)} ${getOppositeCondition(getOperator(getVal(el.test), conditionalOperatorsTable))} ${getVal(el.test.left)} ${getVal(el.test.right)}\n`;
        } else if (el.test.type == "Literal") {
            result += `jump ${line + lenOfAST(el.consequent)} ${getOperator(getVal(el.test), conditionalOperatorsTable)}\n`;
        }
        result += convertAST(el.consequent);
        if (el.alternate != null) {

            if (el.test.type == "BinaryExpression") {
                result += `jump ${line + lenOfAST(el.alternate) - 1} ${getOperator(getVal(el.test), conditionalOperatorsTable)} ${getVal(el.test.left)} ${getVal(el.test.right)}\n`;
            } else if (el.test.type == "Literal") {
                result += `jump ${line + lenOfAST(el.alternate) - 1} ${getOperator(getVal(el.test), conditionalOperatorsTable)}\n`;
            }
            result += convertAST(el.alternate);
        }
    } //TODO: add breaks or continue
    else if (el.type == "ForStatement") {
        let start = line;
        line += 3; //TODO: change this if not gooD
        result += `set ${getVal(el.init.declarations[0].id)} ${getVal(el.init.declarations[0].init)}\n`;
        result += convertAST(el.body);
        result += `op ${getOperator(el.update.right.operator, operatorsTable)} ${el.update.left.name} ${getVal(el.update.right.left)} ${getVal(el.update.right.right)}\n`;
        result += `jump ${start - 1} ${getOperator(getVal(el.test), conditionalOperatorsTable)} ${getVal(el.test.left)} ${getVal(el.test.right)}\n`;
    }//this is a do while loop but not while loop not good but i lazy 
    else if (el.type == "WhileStatement") {
        let start = line;
        line += 1; //TODO: change this if not gooD
        result += convertAST(el.body);
        result += `jump ${start - 1} ${getOperator(getVal(el.test), conditionalOperatorsTable)} ${getVal(el.test.left)} ${getVal(el.test.right)}\n`;
    }
    return result;
}
