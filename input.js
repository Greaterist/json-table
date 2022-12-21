export function input() {
    console.log("input")
    const input = new Object;
    function onChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        if (event.target.files[1]) {
            event.target.files[0] = event.target.files[1];
            event.target.files[1].remove();
        }
        reader.readAsText(event.target.files[0]);
        input.filename = event.target.files[0].name;
    }

    function onReaderLoad(event) {
        input = JSON.parse(event.target.result);
        convert(input);
    }

}