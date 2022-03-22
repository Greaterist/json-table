(function () {

    function onChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event) {
        const input = JSON.parse(event.target.result);
        start(input);
    }


    document.getElementById('file').addEventListener('change', onChange);

}());



function start(input) {
    document.getElementById('generate').addEventListener("click", createJson);
    console.log(input.length)
    let headerList = [];
    let base = document.querySelector('#main');
    let baseInner = scanJson(input);
    baseInner += buildTable();
    base.innerHTML = baseInner;


    function scanJson(input) {
        let tableHeader = "<tr>";
        input.forEach(row => {
            for (let property in row) {
                if (!headerList.includes(property)) {
                    headerList.push(property);
                }
            };
        })
        headerList.forEach(elem => {
            tableHeader += `<th id="${elem}">` + elem + "</th>";
        })
        tableHeader += "</tr>";
        return tableHeader;
    }

    function buildTable() {
        let tableData = "";
        let rowNum = 0;
        input.forEach(row => {
            tableData += "<tr>";
            let aray = [];
            Object.keys(row).map((key, index) => {
                aray[headerList.indexOf(key)] = row[key];
                delete row[key];
            })
            let colNum = 0;
            for (let i = 0; i < headerList.length; i++) {
                if (aray[i] === undefined) {
                    tableData += "<td>" + `<input id="${rowNum}_${colNum++}" class="form-control bg-dark text-white center" type="text" value="">` + "</td>";
                    continue;
                }
                tableData += "<td>" + `<input id="${rowNum}_${colNum++}" class="form-control bg-dark text-white center" type="text" value="${aray[i]}">` + "</td>";
            }
            tableData += "<tr>";
            rowNum++;
        })
        return tableData;
    }

    function createJson() {
        let output = "[";
        for (let i = 0; i < input.length; i++) { //get columns
            let outputRow = "{";
            for (let j = 0; j < headerList.length; j++) { //get rows
                if (getValueIn(i, j) === "") continue; //skip empty 
                outputRow += `"${headerList[j]}":${getValueIn(i, j)}, `
            }
            outputRow = outputRow.slice(0, -2) + "}";
            output += outputRow + ", ";
        }
        output = output.slice(0, -2) + "]";
        console.log(output);
    }

    function getValueIn(x, y) {
        let value = document.getElementById(x + "_" + y);
        return value.value;
    }

    //TODO input variable type




}