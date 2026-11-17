(() => {
  'use strict';

  const byId = id => document.getElementById(id);
  const items = window.InquiryActivities;
  const engine = window.InquiryEngine;
  try {
    engine.validate(items);
  } catch (error) {
    byId('activity').textContent = '활동 자료를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.';
    console.error(error);
    return;
  }

  const storageKey = 'atelier-inquiry60-v1';
  const state = { done: {}, notes: {}, last: '' };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === 'object') {
      for (const { id } of items) {
        if (saved.done?.[id] === true) state.done[id] = true;
        if (typeof saved.notes?.[id] === 'string') state.notes[id] = saved.notes[id];
      }
      if (items.some(item => item.id === saved.last)) state.last = saved.last;
    }
  } catch {}

  const search = byId('search');
  const level = byId('level');
  const remaining = byId('remaining');
  const catalog = byId('catalog');
  const activity = byId('activity');
  const resume = byId('resume');
  const categoryButtons = document.querySelectorAll('[data-category]');
  let category = 'all';
  let current;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }

  function updateProgress() {
    const reviewed = items.filter(item => state.done[item.id]);
    byId('progress-count').textContent = reviewed.length + ' / ' + items.length;
    byId('progress').value = reviewed.length;
    byId('reflection-count').textContent = items.filter(item => state.notes[item.id]?.trim()).length + ' / ' + items.length;
    for (const [id, area] of [
      ['progress-decision', '공정성과 선택'],
      ['progress-data', '데이터 읽기'],
      ['progress-logic', '논증과 알고리즘']
    ]) {
      const total = items.filter(item => item.category === area).length;
      byId(id).textContent = reviewed.filter(item => item.category === area).length + ' / ' + total;
    }
  }

  function renderCatalog() {
    const list = engine.filter(items, category, search.value, remaining.checked, state.done, level.value);
    byId('result-count').textContent = list.length + '개 활동';
    for (const button of categoryButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.category === category));
    }

    const scrollTop = catalog.scrollTop;
    catalog.replaceChildren(...list.map(item => {
      const link = element('a', 'activity-link');
      link.href = '#' + item.id;
      if (item.id === current.id) link.setAttribute('aria-current', 'true');
      link.append(
        element('small', '', item.category + ' / ' + item.level + ' / ' + item.minutes + '분'),
        element('strong', '', item.title),
        element('span', 'record', state.done[item.id] ? '✓ 정답 확인' : '정답 미확인')
      );
      if (item.id === current.id) {
        link.addEventListener('click', event => {
          if (location.hash !== link.hash || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          focusActivity();
        });
      }
      return link;
    }));
    catalog.scrollTop = scrollTop;

    if (!list.length) {
      const empty = element('div', 'empty', '조건에 맞는 활동이 없습니다.');
      const clear = element('button', '', '검색 조건 지우기');
      clear.type = 'button';
      clear.onclick = () => {
        category = 'all';
        search.value = '';
        level.value = '';
        remaining.checked = false;
        renderCatalog();
        search.focus();
      };
      empty.append(clear);
      catalog.append(empty);
    }
  }

  function createTable(data) {
    const wrapper = element('div', 'table-wrap');
    const table = element('table');
    table.append(element('caption', '', data.caption || '판단에 필요한 자료'));
    const header = table.createTHead().insertRow();
    for (const title of data.headers) {
      const cell = element('th', '', title);
      cell.scope = 'col';
      header.append(cell);
    }
    const body = table.createTBody();
    for (const values of data.rows) {
      const row = body.insertRow();
      values.forEach((value, index) => {
        const cell = element(index === 0 ? 'th' : 'td', '', String(value));
        if (index === 0) cell.scope = 'row';
        row.append(cell);
      });
    }
    wrapper.append(table);
    return wrapper;
  }

  function renderJudgment(item) {
    const section = element('section', 'judgment');
    const choices = element('fieldset', 'choices');
    choices.append(element('legend', 'sr-only', '나의 판단 선택'));
    const submit = element('button', 'primary', '판단 확인');
    submit.type = 'button';
    submit.disabled = true;
    const hint = element('details', 'inquiry-hint');
    hint.append(element('summary', '', '힌트 보기'), element('p', '', item.hint));
    const feedback = element('div', 'feedback');
    feedback.setAttribute('role', 'status');
    const solution = element('button', 'secondary', '정답과 근거 보기');
    solution.type = 'button';
    solution.hidden = !state.done[item.id];
    const actions = element('div', 'judgment-actions');
    actions.append(submit, solution);

    item.choices.forEach((text, index) => {
      const label = element('label', 'choice');
      const radio = element('input');
      radio.type = 'radio';
      radio.name = 'answer';
      radio.value = index;
      radio.onchange = () => { submit.disabled = false; };
      label.append(radio, element('span', 'choice-letter', String.fromCharCode(65 + index)), element('span', '', text));
      choices.append(label);
    });

    function showSolution(heading, result) {
      feedback.className = 'feedback correct';
      feedback.replaceChildren(
        element('strong', '', heading),
        element('p', 'answer', '정답 ' + result.answer),
        element('p', '', result.explanation)
      );
      if (!state.done[item.id]) {
        state.done[item.id] = true;
        if (!save()) feedback.append(element('p', '', '브라우저 저장 공간을 사용할 수 없어 이번 확인은 새로고침하면 사라집니다.'));
        updateProgress();
        renderCatalog();
      }
    }

    submit.onclick = () => {
      const selected = choices.querySelector('input:checked');
      if (!selected) return;
      const result = engine.assess(item, Number(selected.value));
      solution.hidden = false;
      if (result.correct) {
        showSolution('선택한 판단이 조건에 맞습니다.', result);
        return;
      }
      feedback.className = 'feedback retry';
      feedback.replaceChildren(
        element('strong', '', '조건을 다시 확인해 보세요.'),
        element('p', '', '힌트를 열고 다시 선택하거나 정답과 근거를 확인할 수 있습니다.')
      );
    };
    solution.onclick = () => showSolution('정답과 근거를 확인했습니다.', engine.assess(item, item.answer));

    section.append(element('h3', 'step-title', '2. 판단하기'), element('p', 'prompt', item.prompt), choices, hint, actions, feedback);
    return section;
  }

  function renderReflection(item) {
    const section = element('section', 'reflection');
    const label = element('label', '', '어떤 조건이나 수치가 판단의 근거였나요?');
    label.htmlFor = 'reflection';
    const note = element('textarea');
    note.id = 'reflection';
    note.rows = 4;
    note.maxLength = 3000;
    note.value = state.notes[item.id] || '';
    note.placeholder = '자료에서 확인한 근거와 처음 생각에서 달라진 점을 적어 보세요.';
    const status = element('p', 'save-note', note.value ? '이 기기에 저장한 기록입니다.' : '');
    status.id = 'reflection-status';
    status.setAttribute('role', 'status');
    note.setAttribute('aria-describedby', status.id);
    note.oninput = () => {
      state.notes[item.id] = note.value;
      status.textContent = save() ? '이 기기에 저장했습니다.' : '브라우저 저장 공간을 사용할 수 없습니다. 내용을 복사해 보관하세요.';
      updateProgress();
    };
    section.append(element('h3', 'step-title', '3. 근거 설명하기'), label, note, status);

    if (item.challenge) {
      const challenge = element('details', 'inquiry-hint challenge');
      challenge.append(element('summary', '', '한 걸음 더 생각하기'), element('p', '', item.challenge));
      section.append(challenge);
    }
    if (item.tryIt?.url && /^\/(?!\/)/.test(item.tryIt.url)) {
      const link = element('a', 'related', item.tryIt.label + ' →');
      link.href = item.tryIt.url;
      section.append(link);
    }
    return section;
  }

  function renderActivity(item) {
    current = item;
    const title = element('h2', '', item.title);
    title.id = 'activity-title';
    title.tabIndex = -1;

    const picker = element('button', 'secondary activity-picker', '활동 목록으로');
    picker.type = 'button';
    picker.onclick = () => byId('library-title').focus();

    activity.replaceChildren(
      element('p', 'eyebrow', item.category + ' / ' + item.level + ' / ' + item.minutes + '분'),
      title,
      picker,
      element('p', 'goal', item.goal),
      element('h3', 'step-title', '1. 상황 살피기'),
      element('p', 'context', item.context)
    );
    if (item.table) activity.append(createTable(item.table));
    activity.append(renderJudgment(item), renderReflection(item));
    activity.setAttribute('aria-labelledby', title.id);

    const position = items.indexOf(item);
    const pager = element('nav', 'pager');
    pager.setAttribute('aria-label', '활동 이동');
    for (const [index, label] of [[position - 1, '← 이전 활동'], [position + 1, '다음 활동 →']]) {
      if (!items[index]) continue;
      const link = element('a', '', label);
      link.href = '#' + items[index].id;
      pager.append(link);
    }
    activity.append(pager);
    renderCatalog();
  }

  function focusActivity() {
    byId('activity-title').focus({ preventScroll: true });
    activity.scrollIntoView({ block: 'start' });
  }

  function itemFromHash() {
    // Activity IDs contain only ASCII letters, digits and hyphens.
    return items.find(item => item.id === location.hash.slice(1));
  }

  function open(item) {
    renderActivity(item);
    state.last = item.id;
    resume.textContent = '현재 활동으로 이동';
    save();
  }

  for (const button of categoryButtons) {
    button.onclick = () => {
      category = button.dataset.category;
      renderCatalog();
    };
  }
  search.oninput = renderCatalog;
  level.onchange = renderCatalog;
  remaining.onchange = renderCatalog;
  resume.onclick = () => {
    if (location.hash === '#' + current.id) focusActivity();
    else location.hash = current.id;
  };

  window.addEventListener('hashchange', () => {
    const item = itemFromHash();
    if (item) {
      if (item !== current || state.last !== item.id) open(item);
      focusActivity();
    } else if (!location.hash) {
      renderActivity(items.find(activity => activity.id === state.last) || items[0]);
    }
  });

  const linkedItem = itemFromHash();
  const lastItem = items.find(item => item.id === state.last);
  updateProgress();
  if (linkedItem) {
    open(linkedItem);
    requestAnimationFrame(focusActivity);
  } else {
    renderActivity(lastItem || items[0]);
    resume.textContent = lastItem ? '지난 활동 이어서 하기' : '탐구 시작하기';
  }
  resume.disabled = false;
})();
