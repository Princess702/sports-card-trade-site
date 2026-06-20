// ============================================================
// EDIT YOUR CARD LISTINGS HERE
// ------------------------------------------------------------
// To update the cards later, edit the values in this list only:
// - name: card/player name shown as the listing title
// - sport: sport used for searching and the small category label
// - team: team shown under the image
// - grade: condition or grading label shown on the card slab
// - price: estimated trade/sale value in whole dollars
// - image: card photo URL or relative path, such as './assets/cards/card-1.jpg'
// - description: short notes about the card, condition, year, set, or parallel
// - accent: optional highlight color for the card border and button styling
// ============================================================
const cards = [
  {
    id: 1,
    name: 'Kevin Garnett facimile',
    sport: 'Baseball',
    team: 'Add Team Name',
    grade: 'Add Grade',
    price: 100,
    accent: '#2f6fdf',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=900&q=80',
    description: 'Add the year, set, player, condition notes, and anything special about this card.',
  },
  {
    id: 2,
    name: 'My Basketball Rookie Card',
    sport: 'Basketball',
    team: 'Add Team Name',
    grade: 'Add Grade',
    price: 100,
    accent: '#d9482b',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',
    description: 'Add the year, set, player, condition notes, and anything special about this card.',
  },
  {
    id: 3,
    name: 'My Football Insert Card',
    sport: 'Football',
    team: 'Add Team Name',
    grade: 'Add Grade',
    price: 100,
    accent: '#b92727',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80',
    description: 'Add the year, set, player, condition notes, and anything special about this card.',
  },
  {
    id: 4,
    name: 'My Graded Basketball Card',
    sport: 'Basketball',
    team: 'Add Team Name',
    grade: 'Add Grade',
    price: 100,
    accent: '#111827',
    image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=900&q=80',
    description: 'Add the year, set, player, condition notes, and anything special about this card.',
  },
  {
    id: 5,
    name: 'My Autograph Card',
    sport: 'Baseball',
    team: 'Add Team Name',
    grade: 'Add Grade',
    price: 100,
    accent: '#0f1d34',
    image: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=900&q=80',
    description: 'Add the year, set, player, condition notes, and anything special about this card.',
  },
  {
    id: 6,
    name: 'My Soccer Card',
    sport: 'Soccer',
    team: 'Add Team Name',
    grade: 'Add Grade',
    price: 100,
    accent: '#ef4aa8',
    image: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=900&q=80',
    description: 'Add the year, set, player, condition notes, and anything special about this card.',
  },
];

let cart = [];
let requests = [
  {
    id: 101,
    customer: 'Maya R.',
    email: 'maya@example.com',
    wanted: cards[0].name,
    offered: '2 images uploaded',
    notes: 'Offering a graded card and cash difference for review.',
    status: 'Pending',
  },
  {
    id: 102,
    customer: 'Jordan P.',
    email: 'jordan@example.com',
    wanted: `${cards[2].name}, ${cards[4].name}`,
    offered: '4 images uploaded',
    notes: 'Interested in a two-card package and has comparable graded cards available.',
    status: 'Accepted',
  },
];

const cardGrid = document.querySelector('#cardGrid');
const search = document.querySelector('#search');
const cartItems = document.querySelector('#cartItems');
const tradeForm = document.querySelector('#tradeForm');
const requestList = document.querySelector('#requestList');
const dashboardMetrics = document.querySelector('#dashboardMetrics');
const files = document.querySelector('#files');
const fileCount = document.querySelector('#fileCount');

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function matches(card, query) {
  return `${card.name} ${card.team} ${card.sport} ${card.grade} ${card.description}`.toLowerCase().includes(query.toLowerCase());
}

function renderCards() {
  const visibleCards = cards.filter(card => matches(card, search.value));
  cardGrid.innerHTML = visibleCards.map(card => `
    <article class="listing" style="--accent:${card.accent}">
      <div class="slab-frame">
        <img src="${card.image}" alt="${card.name} sports card artwork" />
        <span>${card.grade}</span>
      </div>
      <div class="listing-body">
        <p class="team">${card.sport} • ${card.team}</p>
        <h3>${card.name}</h3>
        <p>${card.description}</p>
        <div class="listing-footer">
          <strong>${money(card.price)}</strong>
          <button data-add="${card.id}">${cart.some(item => item.id === card.id) ? 'Added ✓' : 'Add to cart'}</button>
        </div>
      </div>
    </article>
  `).join('') || '<p class="empty-state">No cards match that search yet. Try another player, team, or sport.</p>';
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = '<p class="muted">Add cards you want to buy or trade for. They will be attached to your request.</p>';
    return;
  }
  const total = cart.reduce((sum, card) => sum + card.price, 0);
  cartItems.innerHTML = `${cart.map(card => `<div class="cart-item"><span>${card.name}</span><strong>${money(card.price)}</strong><button aria-label="Remove ${card.name}" data-remove="${card.id}">×</button></div>`).join('')}<strong class="total">Estimated trade value: ${money(total)}</strong>`;
}

function renderMetrics() {
  const pending = requests.filter(request => request.status === 'Pending').length;
  const accepted = requests.filter(request => request.status === 'Accepted').length;
  dashboardMetrics.innerHTML = `
    <article><span>Pending</span><strong>${pending}</strong></article>
    <article><span>Accepted</span><strong>${accepted}</strong></article>
    <article><span>Total value</span><strong>${money(cards.reduce((sum, card) => sum + card.price, 0))}</strong></article>
  `;
}

function renderRequests() {
  requestList.innerHTML = requests.map(request => `<article class="request"><div><span class="status ${request.status.toLowerCase()}">${request.status}</span><h3>${request.customer}</h3><p>${request.email}</p></div><p><strong>Wants:</strong> ${request.wanted}</p><p><strong>Offer:</strong> ${request.offered}</p><p>${request.notes}</p><div class="admin-actions"><button class="accept" data-status="Accepted" data-id="${request.id}">✓ Accept</button><button class="decline" data-status="Declined" data-id="${request.id}">× Decline</button></div></article>`).join('');
  renderMetrics();
}

cardGrid.addEventListener('click', event => {
  const id = Number(event.target.dataset.add);
  if (!id) return;
  const card = cards.find(item => item.id === id);
  if (!cart.some(item => item.id === id)) cart.push(card);
  renderCards();
  renderCart();
});

cartItems.addEventListener('click', event => {
  const id = Number(event.target.dataset.remove);
  if (!id) return;
  cart = cart.filter(card => card.id !== id);
  renderCards();
  renderCart();
});

requestList.addEventListener('click', event => {
  const id = Number(event.target.dataset.id);
  if (!id) return;
  requests = requests.map(request => request.id === id ? { ...request, status: event.target.dataset.status } : request);
  renderRequests();
});

files.addEventListener('change', () => {
  fileCount.textContent = files.files.length ? `${files.files.length} file(s) selected for review` : 'Choose one or more card photos';
});

search.addEventListener('input', renderCards);

tradeForm.addEventListener('submit', event => {
  event.preventDefault();
  const wanted = cart.length ? cart.map(card => card.name).join(', ') : 'General trade offer';
  requests = [{
    id: Date.now(),
    customer: document.querySelector('#name').value,
    email: document.querySelector('#email').value,
    wanted,
    offered: `${files.files.length} image${files.files.length === 1 ? '' : 's'} uploaded`,
    notes: document.querySelector('#notes').value || 'No notes provided.',
    status: 'Pending',
  }, ...requests];
  cart = [];
  tradeForm.reset();
  fileCount.textContent = 'Choose one or more card photos';
  renderCards();
  renderCart();
  renderRequests();
});

renderCards();
renderCart();
renderRequests();
