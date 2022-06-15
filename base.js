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

    for (let i = 0; i < headerList.length; i++) {
        document.getElementById(`${i}`).addEventListener('change', (e)=>{headerList[i]=e.target.value})
    }
    

    function scanJson(input) {
        let tableHeader = "<tr> <th></th>";
        input.forEach(row => {
            for (let property in row) {
                if (!headerList.includes(property)) {
                    headerList.push(property);

                }
            };
        })
        let column=0;
        headerList.forEach(elem => {
            tableHeader += `<th id="${elem}"><input id="${column}" class="form-control center" type="text" value="${elem}"></th>`;
            column++;
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
        return ObjectToJson(input);

     }

    function ArrayToJson(input){
   let output = [];
    for (let i=0; i<input.length; i++){
      let outputRow = {};
      for (let j=0; j<headerList.length; j++){
        if (getValueIn(i, j) ===``) continue;
        outputRow[headerList[j]] = JSON.parse(getValueIn(i, j))
    }
      output.push(outputRow);
    }
   return jsonLineToFormatted(JSON.stringify(output));
  }
    
    function ObjectToJson(input){
   let output = {};
    for (let i=0; i<input.length; i++){
      let outputRow = {};
      for (let j=0; j<headerList.length; j++){
        if (getValueIn(i, j) ===``) continue;
        outputRow[headerList[j]] = JSON.parse(getValueIn(i, j));
    }
      output[inputKeys[i]] = outputRow;
    }
   return jsonLineToFormatted(JSON.stringify(output));
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



