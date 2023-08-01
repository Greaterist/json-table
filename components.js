export function getValueIn(x, y) {
    let value = document.getElementById(x + `_` + y);
    return value.value;
}

export function getType(_input) {
    if (typeof _input == "object") {
        if (_input === null) {
            return "null"
        } else if (_input.constructor === Array)
            return "array"
    }
    return typeof _input;
}