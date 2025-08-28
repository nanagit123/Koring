통합 템플릿 구조 (landmark-style)
개요

모든 페이지는 base.html을 **확장(extends)**해서 사용합니다.

**상단바(Top Bar)**와 **사이드바(Sidebar)**는 base.html에 포함되어 있으며, 모든 페이지에 자동으로 적용됩니다.

각 페이지 HTML은 고유한 콘텐츠만 {% block content %} 안에 작성하면 됩니다.

페이지별 CSS/JS는 필요 시 {% block extra_css %}, {% block extra_js %} 블록에 추가할 수 있습니다.

Flask/Jinja 사용 방법

파일은 반드시 templates/ 디렉터리에 두고, 폴더 구조를 그대로 유지하세요.

공통 CSS/JS는 각각 static/css/base.css, static/js/base.js에 둡니다.

Flask 라우트에서는 일반적으로 렌더링합니다.

return render_template("album.html")


로그인/회원가입 페이지는 동일한 base.html을 사용하지만,
request.endpoint 로직을 통해 <body> 태그에 auth 클래스가 추가됩니다.
→ 이를 통해 로그인/회원가입 페이지만 별도의 스타일을 적용할 수 있습니다.

참고 사항

변환 과정에서 .top-bar, header, .sidebar, #sidebarOverlay 같은 중복된 코드는 제거되었습니다.

만약 특정 페이지에서 동일한 클래스명을 다른 용도로 사용했다면, 직접 복구해야 합니다.

페이지 안에 있던 인라인 스크립트(예: 사이드바 토글 기능)는 제거되었으므로, 필요한 경우 extra_js 블록 안에 넣어야 합니다.