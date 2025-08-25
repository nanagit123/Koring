let video = null;
let canvas = null;
let ctx = null;

window.onload = function () {
    video = document.getElementById('preview');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (err) {
            alert("카메라 접근 실패: " + err.message);
        });
};

function capturePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const image = canvas.toDataURL("image/png");
    document.getElementById("captured-image").src = image;
    document.getElementById("result").style.display = "block";
}

function applyFilter() {
    ctx.filter = 'grayscale(100%)';
    capturePhoto();
}

function insertDate() {
    const date = new Date().toLocaleDateString();
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(date, 20, canvas.height - 40);
    const image = canvas.toDataURL("image/png");
    document.getElementById("captured-image").src = image;
}

async function shareToSNS() {
    const imageElement = document.getElementById("captured-image");
    const imageSrc = imageElement.src;

    if (!imageSrc) {
        alert("먼저 사진을 찍어주세요!");
        return;
    }

    try {
        const blob = await (await fetch(imageSrc)).blob();
        const fileName = `photo_${Date.now()}.png`;

        const formData = new FormData();
        formData.append("image", new File([blob], fileName, { type: "image/png" }));

        const res = await fetch("/upload_image", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        if (data.url) {
            const uploadedUrl = data.url;

            if (navigator.share) {
                await navigator.share({
                    title: 'Koring 여행 사진',
                    text: 'Koring에서 찍은 사진을 공유합니다!',
                    url: uploadedUrl
                });
            } else {
                const choice = prompt("공유할 SNS를 입력하세요 (facebook / kakaotalk / instagram)");

                if (choice === "facebook") {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(uploadedUrl)}`, "_blank", "width=600,height=400");
                } else if (choice === "kakaotalk") {
                    window.open(`kakaolink://send?url=${encodeURIComponent(uploadedUrl)}`);
                } else if (choice === "instagram") {
                    window.location.href = "instagram://camera";
                } else {
                    alert("지원하지 않는 SNS입니다.");
                }
            }
        } else {
            alert("업로드 실패: " + data.error);
        }
    } catch (err) {
        console.error("공유 중 오류:", err);
    }
}

function translateText() {
    alert("사진 속 글자 번역 기능은 아직 구현되지 않았습니다.");
}
