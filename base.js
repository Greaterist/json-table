(function () {
    let filename = "";
    function onChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        if (event.target.files[1]){
          event.target.files[0] = event.target.files[1];
          event.target.files[1].remove();
        }
        reader.readAsText(event.target.files[0]);
        filename = event.target.files[0].name;
    }

    function onReaderLoad(event) {
        const input = JSON.parse(event.target.result);
        start(input, filename);
    }


    document.getElementById('file').addEventListener('change', onChange);

}())


//const { jsonFormattedToLine, jsonLineToFormatted } = await import('https://greaterist.github.io/js-Components/json/stringOperations.js');

function start(input, filename) {
    const inputValues = Object.values(input);
    const inputKeys = Object.keys(input);
    const isArrayInput = Array.isArray(input);
    
    document.getElementById('generate').addEventListener('click', exportFile);
    let headerList = [];
    let base = document.querySelector('#main');
    let baseInner = scanJson(inputValues);
    baseInner += buildTable(inputValues);
    base.innerHTML = baseInner;
    function scanJson(input) {
        let tableHeader = "<tr> <th></th>";
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

    function buildTable(input) {
        let tableData = "";
        let rowNum = 0;
        input.forEach(row => {
            tableData += `<tr> <td>${inputKeys[rowNum]}</td>`;
            let aray = [];
            Object.keys(row).map((key, index) => {
                aray[headerList.indexOf(key)] = row[key];//generate full row
                delete row[key];
            })
            let colNum = 0;
            for (let i = 0; i < headerList.length; i++) {
                if (aray[i] === undefined) {
                    tableData += "<td>" + `<input id="${rowNum}_${colNum++}" class="form-control bg-dark text-white center" type="text" value="">` + "</td>";
                    continue;
                }
                tableData += "<td>" + `<input id="${rowNum}_${colNum++}" class="form-control bg-dark text-white center" type="text" value="${JSON.stringify(aray[i]).replaceAll('"', '&quot;')}">` + "</td>";
            }
            tableData += "<tr>";
            rowNum++;
        })
        return tableData;
    }
    
    function createJson(input, isArrayInput){
       if(isArrayInput){
         return ArrayToJson(input);
       } 

     }

    function ArrayToJson(input) {
        let output = `[`;
        for (let i = 0; i < input.length; i++) { //get columns
            let outputRow = `{`;
            for (let j = 0; j < headerList.length; j++) { //get rows
                if (getValueIn(i, j) === ``) continue; //skip empty 
                outputRow += `"${headerList[j]}":${getValueIn(i, j)}, `
            }
            outputRow = outputRow.slice(0, -2) + `}`;
            output += outputRow + `, `;
        }
        output = output.slice(0, -2) + `]`;;
        return jsonLineToFormatted(output);
    }

    function exportFile() {
        let encodedUri = "data:text/json;charset=utf-8," + createJson(inputValues, isArrayInput);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
    }

    function getValueIn(x, y) {
        let value = document.getElementById(x + `_` + y);
        return value.value;
    }

    function getType(_input) {
        if (typeof _input == "object") {
            if (_input === null) {
                return "null"
            } else if (_input.constructor === Array)
                return "array"
        }
        return typeof _input;
    }

    function jsonLineToFormatted(input) {
        try {
            JSON.parse(input);
        } catch (e) {
            alert(e);
            return null;
        }
        return JSON.stringify(JSON.parse(input), null, "\t");
    }
}



