const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const photos = document.getElementById("photos");

const filter = document.getElementById("filter");
const countdown = document.getElementById("countdown");

let photoList = [];


// =============================
// START CAMERA
// =============================

async function startBooth() {

    document.getElementById("booth")
        .scrollIntoView({
            behavior: "smooth"
        });

    try {

        const stream =
            await navigator.mediaDevices
                .getUserMedia({
                    video: true,
                    audio: false
                });

        video.srcObject = stream;

    } catch (error) {

        alert(
            "Kamera tidak dapat digunakan. " +
            "Pastikan izin kamera sudah diberikan."
        );

    }

}


// =============================
// FILTER
// =============================

filter.addEventListener("change", function () {

    video.style.filter = this.value;

});


// =============================
// COUNTDOWN
// =============================

function startCountdown() {

    return new Promise(resolve => {

        let number = 3;

        countdown.textContent = number;

        const timer = setInterval(() => {

            number--;

            if (number <= 0) {

                clearInterval(timer);

                countdown.textContent = "";

                resolve();

            } else {

                countdown.textContent = number;

            }

        }, 1000);

    });

}


// =============================
// TAKE PHOTO
// =============================

async function takePhoto() {

    if (!video.srcObject) {

        alert("Silakan klik Mulai Foto terlebih dahulu.");

        return;

    }


    await startCountdown();


    const context =
        canvas.getContext("2d");


    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;


    // mirror image
    context.save();

    context.scale(-1, 1);

    context.filter = getComputedStyle(video).filter;

    context.drawImage(
        video,
        -canvas.width,
        0,
        canvas.width,
        canvas.height
    );

    context.restore();


    const image =
        canvas.toDataURL("image/png");


    photoList.push(image);


    displayPhoto(image);

}


// =============================
// DISPLAY PHOTO
// =============================

function displayPhoto(image) {

    const img =
        document.createElement("img");

    img.src = image;

    photos.appendChild(img);

}


// =============================
// DOWNLOAD
// =============================

function downloadPhotos() {

    if (photoList.length === 0) {

        alert("Belum ada foto.");

        return;

    }


    photoList.forEach((photo, index) => {

        const link =
            document.createElement("a");

        link.href = photo;

        link.download =
            `photobooth-${index + 1}.png`;

        link.click();

    });

}