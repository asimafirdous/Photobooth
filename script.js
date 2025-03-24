let selectedTemplate = null;

function selectTemplate(template) {
    const templates = document.querySelectorAll('.template');
    templates.forEach(temp => temp.classList.remove('selected'));
    template.classList.add('selected');
    selectedTemplate = template.src;

    // Update the displayed template immediately
    const templateImage = document.getElementById('templateImage');
    templateImage.src = selectedTemplate;
}

function startCamera() {
    const camera = document.getElementById('camera');
    const captureButton = document.getElementById('captureButton');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            camera.srcObject = stream;
            camera.style.display = 'block';
            captureButton.style.display = 'block';
        })
        .catch(err => alert("Camera access denied."));
}

function captureImage() {
    const camera = document.getElementById('camera');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    canvas.width = camera.videoWidth;
    canvas.height = camera.videoHeight;
    context.drawImage(camera, 0, 0, canvas.width, canvas.height);

    const capturedImage = new Image();
    capturedImage.src = canvas.toDataURL('image/png');
    capturedImage.onload = function() {
        mergeTemplate(capturedImage);
    };
}

function mergeTemplate(capturedImage) {
    if (!selectedTemplate) {
        alert("Please select a template first!");
        return;
    }

    const outputCanvas = document.getElementById('outputCanvas');
    const outputContext = outputCanvas.getContext('2d');
    const templateImage = new Image();
    templateImage.src = selectedTemplate;

    templateImage.onload = function() {
        outputCanvas.width = templateImage.width;
        outputCanvas.height = templateImage.height;

        // Draw template first
        outputContext.drawImage(templateImage, 0, 0, outputCanvas.width, outputCanvas.height);

        // Calculate the position and size to fit inside the polaroid frame
        const polaroidX = outputCanvas.width * 0.27;
        const polaroidY = outputCanvas.height * 0.22;
        const polaroidWidth = outputCanvas.width * 0.45;
        const polaroidHeight = outputCanvas.height * 0.45;

        // Draw the captured image to fit in the polaroid frame
        outputContext.drawImage(capturedImage, polaroidX, polaroidY, polaroidWidth, polaroidHeight);

        // Show the save button after merging
        const saveButton = document.getElementById('saveButton');
        saveButton.style.display = 'block';
    };
}

function saveImage() {
    const outputCanvas = document.getElementById('outputCanvas');
    const finalImage = outputCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = finalImage;
    link.download = 'photobooth_image.png';
    link.click();
}