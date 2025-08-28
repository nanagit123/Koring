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

// ✅ 공통: 현재 프레임을 캔버스에 그려서 dataURL 반환
function drawFrameToCanvas() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
}

function showPreview(dataURL) {
    const img = document.getElementById("captured-image");
    img.src = dataURL;
    img.classList.add("show");     // CSS .preview-thumb.show { display:block; }
}

function capturePhoto() {
    // 필터 없이 기본 캡처
    ctx.filter = 'none';
    const dataURL = drawFrameToCanvas();
    showPreview(dataURL);
}

function applyFilter() {
    // 그레이스케일 필터 적용 → 캡처 → 필터 초기화
    ctx.filter = 'grayscale(100%)';
    const dataURL = drawFrameToCanvas();
    showPreview(dataURL);
    ctx.filter = 'none';
}

function insertDate() {
    // 현재 프레임을 먼저 그리고 날짜 오버레이한 뒤 미리보기 업데이트
    ctx.filter = 'none';
    drawFrameToCanvas();

    const date = new Date().toLocaleDateString();
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "rgba(0,0,0,.6)";
    ctx.lineWidth = 4;

    // 가독성을 위해 테두리 + 채움
    const x = 20;
    const y = canvas.height - 40;
    ctx.strokeText(date, x, y);
    ctx.fillText(date, x, y);

    const dataURL = canvas.toDataURL("image/png");
    showPreview(dataURL);
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
