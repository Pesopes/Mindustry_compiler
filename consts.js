//TODO: complete
const operatorsTable = [
    ["+","add"],
    ["-","sub"],
    ["*","mul"],
    ["/","div"],
    ["//","idiv"],
    ["%","mod"],
    ["-","pow"],
    ["!=","notEqual"],
    ["==","equal"],
    ["<","lessThan"],
    ["<=","lessThanEq"],
    [">","greaterThan"],
    [">=","greaterThanEq"],
    ["===","strictEqual"],

    //these are special functions
    ["-","land"],
    ["-","shl"],
    ["-","shr"],
    ["-","or"],
    ["-","and"],
    ["-","xor"],
    ["-","not"],
    ["-","max"],
    ["-","min"],
    ["-","angle"],
    ["-","len"],
    ["-","noise"],
    ["-","abs"],
    ["-","log"],
    ["-","log10"],
    ["-","sin"],
    ["-","cos"],
    ["-","tan"],
    ["-","floor"],
    ["-","ceil"],
    ["-","sqrt"],
    ["-","rand"],
    ["-","and"]
]

//TODO: also complete
const conditionalOperatorsTable = [
    ["!=","notEqual"],
    ["==","equal"],
    ["<","lessThan"],
    ["<=","lessThanEq"],
    [">","greaterThan"],
    [">=","greaterThanEq"],
    ["===","strictEqual"],
    ["false","always"]
]

const oppositeConditionsTable = [
    ["equal","notEqual"],
    ["notEqual","equal"],
    ["greaterThanEq","lessThan"],
    ["greaterThan","lessThanEq"],
    ["lessThanEq","greaterThan"],
    ["lessThan","greaterThanEq"],
    ["notEqual","strictEqual"],
    //dont know what to do with this
    ["always","always"]
]