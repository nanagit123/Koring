document.addEventListener("DOMContentLoaded", () => {
    const signupBtn = document.getElementById("signupBtn");
  
    signupBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value.trim();
      const username = document.getElementById("signupId").value.trim();
      const password = document.getElementById("signupPw").value.trim();
  
      if (!email || !username || !password) {
        alert("모든 항목을 입력해주세요.");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:3000/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password }),
        });
  
        const result = await response.json();
  
        if (result.success) {
          alert("회원가입 완료! 로그인 페이지로 이동합니다.");
          window.location.href = "login.html";
        } else {
          alert("회원가입 실패: " + result.message);
        }
      } catch (err) {
        console.error("회원가입 중 오류:", err);
        alert("서버에 연결할 수 없습니다.");
      }
    });
  });
  