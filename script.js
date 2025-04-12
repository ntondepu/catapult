// Script to handle file upload interaction
document.getElementById('uploadButton').addEventListener('click', function() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];

    if (file) {
        alert('File selected: ' + file.name);
    } else {
        alert('Please select a file first');
    }
});

