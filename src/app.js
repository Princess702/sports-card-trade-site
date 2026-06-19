const cards = [
  { id: 1, name: 'Shohei Ohtani Chrome Refractor', team: 'Los Angeles Dodgers', price: 185, description: '2024 Topps Chrome refractor with sharp corners and bright surface gloss.', image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=900&q=80' },
  { id: 2, name: 'Caitlin Clark Rookie Showcase', team: 'Indiana Fever', price: 240, description: 'Highly sought-after rookie insert, sleeved and top-loaded immediately.', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80' },
  { id: 3, name: 'Patrick Mahomes Prizm Silver', team: 'Kansas City Chiefs', price: 320, description: 'Premium Prizm Silver parallel with excellent eye appeal for football collectors.', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80' },
  { id: 4, name: 'Victor Wembanyama Court Kings', team: 'San Antonio Spurs', price: 210, description: 'Modern basketball art card featuring one of the hobby’s most exciting young stars.', image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=900&q=80' },
  { id: 5, name: 'Aaron Judge Stadium Club Auto', team: 'New York Yankees', price: 450, description: 'On-card autograph presentation piece for serious Yankees and slugger collections.', image: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=900&q=80' },
  { id: 6, name: 'Lionel Messi Global Icons', team: 'Inter Miami CF', price: 175, description: 'Colorful soccer insert with clean centering and a bold action photograph.', image: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=900&q=80' },
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

function money(value) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value); }
function matches(card, query) { return `${card.name} ${card.team} ${card.description}`.toLowerCase().includes(query.toLowerCase()); }

function renderCards() {
  const visibleCards = cards.filter(card => matches(card, search.value));
  cardGrid.innerHTML = visibleCards.map(card => `<article class="listing"><img src="${card.image}" alt="${card.name} card" /><div class="listing-body"><p class="team">${card.team}</p><h3>${card.name}</h3><p>${card.description}</p><div class="listing-footer"><strong>${money(card.price)}</strong><button data-add="${card.id}">${cart.some(item => item.id === card.id) ? 'In cart' : 'Add to cart'}</button></div></div></article>`).join('');
}

function renderCart() {
  if (!cart.length) { cartItems.innerHTML = '<p class="muted">Add cards you want to buy or trade for. They will be attached to your request.</p>'; return; }
  const total = cart.reduce((sum, card) => sum + card.price, 0);
  cartItems.innerHTML = `${cart.map(card => `<div class="cart-item"><span>${card.name}</span><button aria-label="Remove ${card.name}" data-remove="${card.id}">×</button></div>`).join('')}<strong class="total">Estimated value: ${money(total)}</strong>`;
}

function renderRequests() {
  requestList.innerHTML = requests.map(request => `<article class="request"><div><span class="status ${request.status.toLowerCase()}">${request.status}</span><h3>${request.customer}</h3><p>${request.email}</p></div><p><strong>Wants:</strong> ${request.wanted}</p><p><strong>Offer:</strong> ${request.offered}</p><p>${request.notes}</p><div class="admin-actions"><button class="accept" data-status="Accepted" data-id="${request.id}">✓ Accept</button><button class="decline" data-status="Declined" data-id="${request.id}">× Decline</button></div></article>`).join('');
}

cardGrid.addEventListener('click', event => {
  const id = Number(event.target.dataset.add);
  if (!id) return;
  const card = cards.find(item => item.id === id);
  if (!cart.some(item => item.id === id)) cart.push(card);
  renderCards(); renderCart();
});

cartItems.addEventListener('click', event => {
  const id = Number(event.target.dataset.remove);
  if (!id) return;
  cart = cart.filter(card => card.id !== id);
  renderCards(); renderCart();
});

requestList.addEventListener('click', event => {
  const id = Number(event.target.dataset.id);
  if (!id) return;
  requests = requests.map(request => request.id === id ? { ...request, status: event.target.dataset.status } : request);
  renderRequests();
});

files.addEventListener('change', () => { fileCount.textContent = files.files.length ? `${files.files.length} file(s) selected` : 'Choose one or more card photos'; });
search.addEventListener('input', renderCards);
tradeForm.addEventListener('submit', event => {
  event.preventDefault();
  const wanted = cart.length ? cart.map(card => card.name).join(', ') : 'General trade offer';
  requests = [{ id: Date.now(), customer: document.querySelector('#name').value, email: document.querySelector('#email').value, wanted, offered: `${files.files.length} image${files.files.length === 1 ? '' : 's'} uploaded`, notes: document.querySelector('#notes').value || 'No notes provided.', status: 'Pending' }, ...requests];
  cart = []; tradeForm.reset(); fileCount.textContent = 'Choose one or more card photos';
  renderCards(); renderCart(); renderRequests();
});

renderCards(); renderCart(); renderRequests();
