import start from './main.js'

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




