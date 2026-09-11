(function () {
  'use strict';
  const STORAGE_KEY = 'eclipse_donations_v2';
  const $ = (id) => document.getElementById(id);

  function getDonations() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(value) ? value.filter(x => typeof x === 'string') : [];
    } catch (_) { return []; }
  }

  function saveDonations(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function updateStats() {
    const count = getDonations().length;
    $('pileStat').textContent = String(count);
    $('donationStat').textContent = String(count);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function renderDonations(items) {
    if (!items.length) return '<div class="empty">No donations yet.</div>';
    return items.map((name, i) => `<div class="donation-item"><span>${escapeHtml(name)}</span><span>#${i + 1}</span></div>`).join('');
  }

  function showModal(type) {
    const modal = $('modal');
    const content = $('modalContent');
    const items = getDonations();

    if (type === 'donate') {
      content.innerHTML = `
        <div class="eyebrow">DONATE</div>
        <h2>Add a donation</h2>
        <p>Enter a name or label for the donation.</p>
        <input id="donationName" class="field" maxlength="60" placeholder="Donation name" autocomplete="off">
        <button type="button" class="primary" id="submitDonation">Submit donation</button>`;
      $('submitDonation').addEventListener('click', submitDonation);
      setTimeout(() => $('donationName').focus(), 0);
    } else if (type === 'getdonated') {
      if (!items.length) {
        content.innerHTML = `<div class="eyebrow">GET DONATED</div><h2>Pile is empty</h2><p>There are no donations available right now.</p>`;
      } else {
        const pickedIndex = Math.floor(Math.random() * items.length);
        const picked = items[pickedIndex];
        items.splice(pickedIndex, 1);
        saveDonations(items);
        updateStats();
        content.innerHTML = `<div class="eyebrow">GET DONATED</div><h2>You got a donation!</h2><p>Your random donation is:</p><div class="reward"><strong>${escapeHtml(picked)}</strong></div><p class="muted">It has been removed from the pile.</p>`;
      }
    } else {
      content.innerHTML = `<div class="eyebrow">PILE</div><h2>Donation pile</h2><p>There are currently <strong>${items.length}</strong> donation${items.length === 1 ? '' : 's'} in the pile.</p><p class="muted">The contents of the pile are hidden.</p>`;
    }
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  }

  function submitDonation() {
    const input = $('donationName');
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    const items = getDonations();
    items.push(name);
    saveDonations(items);
    updateStats();
    $('modalContent').innerHTML = `<div class="eyebrow">SUCCESS</div><h2>Donation added</h2><p>Your donation was added to the pile.</p><button type="button" class="primary" id="viewPile">View pile amount</button>`;
    $('viewPile').addEventListener('click', () => showModal('pile'));
  }

  function closeModal() {
    const modal = $('modal');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  $('donateButton').addEventListener('click', () => showModal('donate'));
  $('getDonatedButton').addEventListener('click', () => showModal('getdonated'));
  $('pileButton').addEventListener('click', () => showModal('pile'));
  $('closeButton').addEventListener('click', closeModal);
  $('modal').addEventListener('click', e => { if (e.target === $('modal')) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  updateStats();
  $('statusText').textContent = 'Dashboard ready';
})();
