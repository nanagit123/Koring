document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");
  
    loginBtn.addEventListener("click", async () => {
      const username = document.getElementById("loginId").value.trim();
      const password = document.getElementById("loginPw").value.trim();
  
      if (!username || !password) {
        alert("아이디와 비밀번호를 모두 입력해주세요.");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
  
        const result = await response.json();
  
        if (result.success) {
          alert(`${username}님 환영합니다!`);
          window.location.href = "index.html"; // 로그인 성공 시 이동
        } else {
          alert("로그인 실패: " + result.message);
        }
      } catch (err) {
        console.error("로그인 중 오류 발생:", err);
        alert("서버에 연결할 수 없습니다.");
      }
    });
  });
  