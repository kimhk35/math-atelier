const fs = require('node:fs');

const version = '20261118-classroom-kits';
const releaseId = 'd1118';
const date = '2026년 11월 18일';
const title = '수학 판단 공방에 15분 수업 꾸러미를 추가했습니다';
const updatesUrl = '/updates/#' + releaseId;
const stats = [[60, '탐구 활동', '개'], [3, '수업 꾸러미', '종'], [60, '문제별 힌트', '개']];
const content = `
  <p class="an-intro">11월 16일에 추가한 수학 판단 공방을 업데이트했습니다. 공정성과 선택 / 데이터 읽기 / 논증과 알고리즘을 주제로 영역마다 20개 활동을 제공합니다.</p>
  <ol class="an-list">
    <li>
      <h3>15분 수업 꾸러미 3종</h3>
      <p>같은 건수와 다른 비율 및 공정한 배분과 반례를 주제로 수업 꾸러미를 만들었습니다. 예측 3분과 탐구 7분과 토론 5분으로 구성했습니다. 수업 QR 공유와 학생용 학습지 인쇄 및 교사용 답안을 제공합니다.</p>
      <a class="an-more" href="/exploration-pack/classroom/">수업 꾸러미 열기 →</a>
    </li>
    <li>
      <h3>분모를 바꾸는 미니 실험</h3>
      <p>연체 건수를 30건으로 고정하고 도서관별 전체 대출 건수를 바꿔 보세요. 어느 쪽의 연체율이 높은지 먼저 예상하고 막대그래프로 확인합니다. 두 연체율이 같아지는 조건도 찾아볼 수 있습니다.</p>
      <a class="an-more" href="/exploration-pack/denominator/">미니 실험 열기 →</a>
    </li>
    <li>
      <h3>문제별 힌트로 다시 판단하기</h3>
      <p>60개 활동마다 어떤 조건이나 수치를 먼저 비교할지 안내합니다. 처음 선택이 틀리면 힌트를 읽고 다시 답을 고르거나 정답과 근거를 직접 열어 볼 수 있습니다.</p>
    </li>
    <li>
      <h3>영역과 권장 수준으로 활동 찾기</h3>
      <p>개념 검색에 중학교 이상과 고등학교 이상 수준을 함께 적용할 수 있습니다. 정답을 확인하지 않은 활동만 골라 보거나 지난 활동을 이어서 할 수 있습니다.</p>
    </li>
    <li>
      <h3>탐구와 성찰 기록 살펴보기</h3>
      <p>영역별 정답 확인 수와 성찰 기록 수를 볼 수 있습니다. 풀이를 확인한 뒤 어떤 조건이 판단의 근거였는지 기록해 보세요. 기존 기록과 새 기록은 같은 브라우저에서 확인할 수 있습니다.</p>
      <a class="an-more" href="/exploration-pack/">수학 판단 공방 열기 →</a>
    </li>
  </ol>`;

const read = file => fs.readFileSync('public/' + file, 'utf8');
const write = (file, content) => fs.writeFileSync('public/' + file, content);
function replace(text, search, replacement) {
  const updated = text.replace(search, replacement);
  if (updated === text) throw new Error('Missing Atelier integration anchor: ' + search);
  return updated;
}

fs.cpSync('fair-share', 'public/fair-share', { recursive: true });
for (const file of ['index.html', 'advanced-math/index.html', 'origami/index.html', 'updates/index.html']) {
  let html = read(file);
  const css = `<link rel="stylesheet" href="/atelier-ui/explore.css?v=${version}">`;
  html = html.includes('</head>') ? html.replace('</head>', css + '</head>') : html.replace('<body', css + '<body');
  if (file === 'index.html') {
    html = replace(html, '</body>', `<script src="/atelier-ui/explore.js?v=${version}"></script></body>`);
    html = replace(html, /updates\/notice\.js\?v=[^"]+/, 'updates/notice.js?v=' + version);
  }
  if (file === 'updates/index.html') {
    html = replace(html, /(<nav class="toc"[^>]*>)/, `$1<a href="#${releaseId}">11월 18일 / 수학 판단 공방</a><a href="#d1113">11월 13일 / 고급수학과 종이접기</a>`);
    html = replace(html, '<section class="day" id="d1113">', `<section class="day" id="${releaseId}"><h2><time datetime="2026-11-18">${date}</time> <small>수학 판단 공방 탐구 개선</small></h2>${content}</section><section class="day" id="d1113">`);
  }
  write(file, html);
}

write('updates/notice-content.js', 'export const NOTICE_TITLE = ' + JSON.stringify(title) + ';\nexport const NOTICE_BODY = ' + JSON.stringify(content) + ';\n');
let notice = read('updates/notice.js');
notice = replace(notice, /\.\/notice-content\.js\?v=[^']+/, './notice-content.js?v=' + version);
notice = replace(notice, /\.\/notice-policy\.js\?v=[^']+/, './notice-policy.js?v=' + version);
notice = replace(notice, '2026년 11월 13일', date);
notice = notice.replaceAll('/updates/#d1113', updatesUrl);
notice = replace(notice, '100개와 500개 확장 소식', '수학 판단 공방 업데이트');
notice = replace(notice, /<div class="an-stats">[\s\S]*?\$\{NOTICE_BODY\}/,
  '<div class="an-stats">' + stats.map(([value, label, unit]) =>
    `<div class="an-stat"><b>${value}<em class="an-unit">${unit}</em></b><small>${label}</small></div>`
  ).join('') + '</div>${NOTICE_BODY}');
notice = replace(notice, "dialog.querySelector('.an-more').addEventListener('click', () => dialog.close());",
  "dialog.querySelectorAll('a').forEach(link => link.addEventListener('click', () => dialog.close()));");
write('updates/notice.js', notice);
write('updates/notice-policy.js',
  replace(read('updates/notice-policy.js'), '2026-11-13-notice500-hidden-day', '2026-11-18-inquiry-hidden-day'));

require('./integrate-pack.cjs');

const serviceWorker = replace(read('sw.js'), /const VERSION = "[^"]+";/, `const VERSION = "${version}";`);
write('sw.js', replace(serviceWorker, 'const CORE = [', 'const CORE = ["/atelier-ui/explore.css", "/atelier-ui/explore.js", '));
console.log('Inquiry activity guide and November 18 update notice integrated.');
