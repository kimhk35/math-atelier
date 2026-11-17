'use strict';

const lateLoans = 30;
const initialLoans = [300, 1000];
const maxLoans = 3000;
const chartScales = [2, 5, 10, 20, 50, 100];

function compareLoans(a, b) {
  const rates = [a, b].map(total => lateLoans * 100 / total);
  return {
    rates,
    higherRate: a === b ? 'equal' : a < b ? 'a' : 'b',
    scale: chartScales.find(max => max >= Math.max(...rates))
  };
}

if (typeof module !== 'undefined') module.exports = { compareLoans };

if (typeof document !== 'undefined') {
  const byId = id => document.getElementById(id);
  const form = byId('prediction-form');
  const reveal = byId('reveal');
  const feedback = byId('prediction-feedback');
  const experiment = byId('experiment');
  const comparison = byId('comparison');
  const challenge = byId('challenge-result');
  const formatNumber = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 2, useGrouping: false });
  const formatRate = rate => formatNumber.format(rate) + '%';
  const libraries = ['a', 'b'].map(id => ({
    total: byId(id + '-total'),
    range: byId(id + '-range'),
    fraction: byId(id + '-fraction'),
    rate: byId(id + '-rate'),
    bar: byId(id + '-bar')
  }));
  const comparisons = {
    a: 'A 도서관의 연체율이 더 높습니다.',
    equal: '두 도서관의 연체율이 같습니다.',
    b: 'B 도서관의 연체율이 더 높습니다.'
  };

  function render() {
    const totals = libraries.map(library => library.range.valueAsNumber);
    const { rates, higherRate, scale } = compareLoans(...totals);
    libraries.forEach((library, index) => {
      library.fraction.textContent = lateLoans + '건 / ' + totals[index] + '건';
      library.rate.textContent = formatRate(rates[index]);
      library.bar.style.width = (rates[index] / scale * 100) + '%';
    });
    byId('axis-middle').textContent = scale / 2 + '%';
    byId('axis-max').textContent = scale + '%';

    const message = comparisons[higherRate];
    if (comparison.textContent !== message) comparison.textContent = message;
    challenge.hidden = higherRate !== 'equal';
  }

  for (const { total, range } of libraries) {
    function acceptTotal() {
      const valid = total.validity.valid;
      if (valid) {
        range.value = total.value;
        total.removeAttribute('aria-invalid');
        render();
      } else {
        total.setAttribute('aria-invalid', 'true');
      }
    }

    range.addEventListener('input', () => {
      total.value = range.value;
      total.removeAttribute('aria-invalid');
      render();
    });
    total.addEventListener('input', acceptTotal);
    total.addEventListener('change', () => {
      const value = total.valueAsNumber;
      total.value = Number.isFinite(value)
        ? Math.min(maxLoans, Math.max(lateLoans, Math.round(value)))
        : range.value;
      acceptTotal();
    });
    total.addEventListener('keydown', event => {
      if (event.key === 'Enter') total.blur();
    });
  }

  form.hidden = false;
  form.addEventListener('change', () => { reveal.disabled = false; });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const prediction = new FormData(form).get('prediction');
    if (!prediction) return;
    const { higherRate, rates } = compareLoans(...initialLoans);
    const prefix = prediction === higherRate ? '예상과 같았어요.' : '처음 예상과 비교해 보세요.';
    feedback.textContent = prefix + ' 처음 연체율은 A ' + formatRate(rates[0]) + '와 B ' + formatRate(rates[1]) + '입니다.';
    feedback.hidden = false;
    form.hidden = true;
    experiment.hidden = false;
    render();
    byId('experiment-title').focus();
  });

  byId('reset').addEventListener('click', () => {
    libraries.forEach(({ total, range }, index) => {
      total.value = range.value = initialLoans[index];
      total.removeAttribute('aria-invalid');
    });
    form.reset();
    reveal.disabled = true;
    experiment.hidden = true;
    feedback.hidden = true;
    form.hidden = false;
    byId('prediction-title').focus();
  });
}
