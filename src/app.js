const cards = [
  { id: 1, name: 'Shohei Ohtani Chrome Refractor', team: 'Los Angeles Dodgers', price: 185, grade: 'Raw NM-MT', rarity: 'Chrome Refractor', palette: 'blue', description: '2024 Topps Chrome refractor with sharp corners, clean centering, and bright surface gloss.' },
  { id: 2, name: 'Caitlin Clark Rookie Showcase', team: 'Indiana Fever', price: 240, grade: 'PSA Ready', rarity: 'Rookie Insert', palette: 'gold', description: 'High-demand rookie insert, sleeved immediately and protected in a fresh top loader.' },
  { id: 3, name: 'Patrick Mahomes Prizm Silver', team: 'Kansas City Chiefs', price: 320, grade: 'BGS 9', rarity: 'Silver Prizm', palette: 'red', description: 'Premium football parallel with crisp edges and standout eye appeal for Chiefs collectors.' },
  { id: 4, name: 'Victor Wembanyama Court Kings', team: 'San Antonio Spurs', price: 210, grade: 'Raw Mint', rarity: 'Art Insert', palette: 'purple', description: 'Modern basketball art card featuring one of the hobby’s most exciting young stars.' },
  { id: 5, name: 'Aaron Judge Stadium Club Auto', team: 'New York Yankees', price: 450, grade: 'Auto 10', rarity: 'On-card Auto', palette: 'navy', description: 'Signature showcase piece for serious Yankees collections with a bold on-card autograph.' },
  { id: 6, name: 'Lionel Messi Global Icons', team: 'Inter Miami CF', price: 175, grade: 'Raw NM', rarity: 'Global Icons', palette: 'teal', description: 'Colorful soccer insert with clean borders, strong centering, and a premium action layout.' },
];

let cart = [];
let requests = [{ id: 101, customer: 'Maya R.', email: 'maya@example.com', wanted: 'Shohei Ohtani Chrome Refractor', offered: '2 images uploaded', notes: 'Offering a PSA 9 Acuña rookie and cash difference.', status: 'Pending' }];

const cardGrid = document.querySelector('#cardGrid');
const search = document.querySelector('#search');
const cartItems = document.querySelector('#cartItems');
const tradeForm = document.querySelector('#tradeForm');
const requestList = document.querySelector('#requestList');
const files = document.querySelector('#files');
const fileCount = document.querySelector('#fileCount');
const pendingCount = document.querySelector('#pendingCount');
const acceptedCount = document.querySelector('#acceptedCount');
const declinedCount = document.querySelector('#declinedCount');

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function matches(card, query) {
  return `${card.name} ${card.team} ${card.description} ${card.rarity}`.toLowerCase().includes(query.toLowerCase());
}

function cardArtwork(card) {
  const initials = card.name.split(' ').slice(0, 2).map(part => part[0]).join('');
  return `<div class="card-art ${card.palette}"><div class="card-shine"></div><span class="card-label">${card.rarity}</span><strong>${initials}</strong><small>${card.team}</small><em>${card.grade}</em></div>`;
}

function renderCards() {
  const visibleCards = cards.filter(card => matches(card, search.value));
  cardGrid.innerHTML = visibleCards.map(card => `<article class="listing">${cardArtwork(card)}<div class="listing-body"><div><p class="team">${card.team}</p><h3>${card.name}</h3></div><p>${card.description}</p><div class="listing-meta"><span>${card.grade}</span><span>${card.rarity}</span></div><div class="listing-footer"><strong>${money(card.price)}</strong><button data-add="${card.id}">${cart.some(item => item.id === card.id) ? 'Added' : 'Add to trade cart'}</button></div></div></article>`).join('');
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = '<p class="muted">Your trade cart is empty. Add cards from the marketplace to attach them to a request.</p><div class="empty-cart">No cards selected yet</div>';
    return;
  }
  const total = cart.reduce((sum, card) => sum + card.price, 0);
  cartItems.innerHTML = `${cart.map(card => `<div class="cart-item"><div><strong>${card.name}</strong><span>${card.team} • ${money(card.price)}</span></div><button aria-label="Remove ${card.name}" data-remove="${card.id}">×</button></div>`).join('')}<div class="cart-total"><span>Estimated market value</span><strong>${money(total)}</strong></div>`;
}

function renderRequests() {
  requestList.innerHTML = requests.map(request => `<article class="request"><div class="request-head"><div><span class="status ${request.status.toLowerCase()}">${request.status}</span><h3>${request.customer}</h3><p>${request.email}</p></div><span class="request-id">#${request.id}</span></div><dl><div><dt>Requested cards</dt><dd>${request.wanted}</dd></div><div><dt>Collector offer</dt><dd>${request.offered}</dd></div><div><dt>Notes</dt><dd>${request.notes}</dd></div></dl><div class="admin-actions"><button class="accept" data-status="Accepted" data-id="${request.id}">Accept trade</button><button class="decline" data-status="Declined" data-id="${request.id}">Decline</button></div></article>`).join('');
  pendingCount.textContent = requests.filter(request => request.status === 'Pending').length;
  acceptedCount.textContent = requests.filter(request => request.status === 'Accepted').length;
  declinedCount.textContent = requests.filter(request => request.status === 'Declined').length;
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
  fileCount.textContent = files.files.length ? `${files.files.length} file(s) selected and ready to submit` : 'PNG, JPG, or WEBP accepted';
});

search.addEventListener('input', renderCards);

tradeForm.addEventListener('submit', event => {
  event.preventDefault();
  const wanted = cart.length ? cart.map(card => card.name).join(', ') : 'General trade offer';
  requests = [{ id: Date.now(), customer: document.querySelector('#name').value, email: document.querySelector('#email').value, wanted, offered: `${files.files.length} image${files.files.length === 1 ? '' : 's'} uploaded`, notes: document.querySelector('#notes').value || 'No notes provided.', status: 'Pending' }, ...requests];
  cart = [];
  tradeForm.reset();
  fileCount.textContent = 'PNG, JPG, or WEBP accepted';
  renderCards();
  renderCart();
  renderRequests();
});

renderCards();
renderCart();
renderRequests();
