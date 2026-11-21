/*
 * Page-view counter (busuanzi) that counts a visit only once.
 *
 * busuanzi adds 1 every time a page loads, so clicking Home -> Projects -> Home
 * counted 3 views. Here the busuanzi script is only loaded when this browser
 * has not viewed the site in the last 30 minutes; otherwise the last number we
 * got is shown from localStorage and nothing is counted.
 */
(function () {
	var KEY = 'busuanzi_pv_cache';
	var VISIT_GAP = 30 * 60 * 1000; // 30 minutes without a page view = new visit

	var box = document.getElementById('busuanzi_container_site_pv');
	var value = document.getElementById('busuanzi_value_site_pv');
	if (!box || !value) return;

	function save(v) {
		try {
			localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() }));
		} catch (e) {}
	}

	var cached = null;
	try {
		cached = JSON.parse(localStorage.getItem(KEY));
	} catch (e) {}
	var lastValue = cached && cached.v ? cached.v : null;

	// Same visit: don't count again. Show the last known number (if we have
	// one yet) and keep the visit alive.
	if (cached && Date.now() - cached.t < VISIT_GAP) {
		if (lastValue) {
			value.textContent = lastValue;
			box.style.display = 'inline';
		}
		save(lastValue);
		return;
	}

	// New visit: mark it right away, so a page opened before busuanzi answers
	// does not count the same visit again.
	save(lastValue);

	// Let busuanzi count it, then remember the number it returns.
	new MutationObserver(function (_, observer) {
		var v = value.textContent.trim();
		if (v) {
			save(v);
			observer.disconnect();
		}
	}).observe(value, { childList: true, characterData: true, subtree: true });

	var s = document.createElement('script');
	s.async = true;
	s.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
	document.body.appendChild(s);
})();
