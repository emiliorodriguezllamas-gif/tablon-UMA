// ============================================
// TABLÓN UMA - Aplicación Principal
// ============================================

const App = {
  currentPage: 'feed',
  currentChatUser: null,
  currentProfileUser: null,
  rideFilter: 'all',
  eventFilter: 'all',
  searchTimeout: null,

  // ---- Initialization ----
  init() {
    DB.init();
    this.checkSession();
    this.setupEventListeners();
  },

  checkSession() {
    const user = DB.getCurrentUser();
    if (user) {
      this.enterApp(user);
    } else {
      this.showLogin();
    }
  },

  // ============================================
  // AUTH
  // ============================================
  showLogin() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('app-page').style.display = 'none';
    this.renderQuickLogin();
  },

  renderQuickLogin() {
    const grid = document.getElementById('quick-login-grid');
    const users = DB.getAll(DB.KEYS.USERS);
    grid.innerHTML = users.map(u => `
      <button class="login-user-btn" onclick="App.quickLogin('${u.id}')">
        <div class="avatar" style="background:${u.avatarColor};">${this.getInitials(u.name)}</div>
        <div>
          <div style="font-weight:600;">${u.name.split(' ')[0]}</div>
          <div style="font-size:0.65rem; color:var(--text-muted);">${u.town}</div>
        </div>
      </button>
    `).join('');
  },

  quickLogin(userId) {
    DB.setSession(userId);
    const user = DB.getById(DB.KEYS.USERS, userId);
    if (user) {
      this.enterApp(user);
      this.showToast(`¡Bienvenid@ de nuevo, ${user.name.split(' ')[0]}! 🎉`, 'success');
    }
  },

  handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const users = DB.getAll(DB.KEYS.USERS);
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      DB.setSession(user.id);
      this.enterApp(user);
      this.showToast(`¡Bienvenid@ de nuevo, ${user.name.split(' ')[0]}! 🎉`, 'success');
    } else {
      const errEl = document.getElementById('login-error');
      errEl.style.display = 'block';
      setTimeout(() => errEl.style.display = 'none', 3000);
    }
  },

  logout() {
    DB.clearSession();
    this.currentPage = 'feed';
    this.currentChatUser = null;
    this.closeDropdowns();
    this.showLogin();
    this.showToast('Sesión cerrada. ¡Hasta pronto! 👋', 'info');
  },

  enterApp(user) {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('app-page').style.display = 'block';
    this.updateHeader(user);
    this.renderSidebarFriends(user);
    this.updateNotificationBadges();
    this.navigateTo('feed');
  },

  // ============================================
  // HEADER & NAV
  // ============================================
  updateHeader(user) {
    document.getElementById('header-avatar').style.background = user.avatarColor;
    document.getElementById('header-avatar').textContent = this.getInitials(user.name);
    document.getElementById('header-username').textContent = user.name.split(' ')[0];
  },

  navigateTo(page) {
    this.currentPage = page;
    this.closeDropdowns();
    this.closeSidebar();

    // Update active states
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // Show/hide sections
    document.querySelectorAll('.page-section').forEach(section => {
      section.classList.remove('active');
    });
    const target = document.getElementById(`section-${page}`);
    if (target) target.classList.add('active');

    // Render page content
    switch (page) {
      case 'feed': this.renderFeed(); break;
      case 'events': this.renderEvents(); break;
      case 'rides': this.renderRides(); break;
      case 'messages': this.renderMessages(); break;
      case 'friends': this.renderFriends(); break;
      case 'profile':
        this.currentProfileUser = null;
        this.renderProfile();
        break;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));

    // Hamburger
    document.getElementById('hamburger-btn').addEventListener('click', () => this.toggleSidebar());
    document.getElementById('sidebar-overlay').addEventListener('click', () => this.closeSidebar());

    // Header buttons
    document.getElementById('header-user-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown('user-dropdown');
    });
    document.getElementById('btn-notifications').addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown('notifications-panel');
      this.renderNotifications();
    });
    document.getElementById('btn-messages-header').addEventListener('click', () => {
      this.navigateTo('messages');
    });
    document.getElementById('header-logo').addEventListener('click', () => {
      this.navigateTo('feed');
    });

    // Global search
    document.getElementById('global-search').addEventListener('input', (e) => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => this.handleSearch(e.target.value), 300);
    });

    // Close dropdowns on click outside
    document.addEventListener('click', () => this.closeDropdowns());
  },

  toggleSidebar() {
    document.getElementById('app-sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('show');
  },

  closeSidebar() {
    document.getElementById('app-sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('show');
  },

  toggleDropdown(id) {
    const el = document.getElementById(id);
    const isShowing = el.classList.contains('show');
    this.closeDropdowns();
    if (!isShowing) {
      el.classList.add('show');
    }
  },

  closeDropdowns() {
    document.querySelectorAll('.user-dropdown, .notifications-panel').forEach(el => {
      el.classList.remove('show');
    });
  },

  renderSidebarFriends(user) {
    if (!user) user = DB.getCurrentUser();
    if (!user) return;
    const allUsers = DB.getAll(DB.KEYS.USERS);
    const friends = allUsers.filter(u => user.friends.includes(u.id));

    document.getElementById('sidebar-friends').innerHTML = friends.map(f => `
      <button class="friend-mini-item" onclick="App.viewProfile('${f.id}')">
        <div class="avatar" style="background:${f.avatarColor};">${this.getInitials(f.name)}</div>
        <span>${f.name.split(' ')[0]} ${f.name.split(' ')[1] || ''}</span>
        <div class="online-indicator ${f.online ? 'online' : 'offline'}"></div>
      </button>
    `).join('');
  },

  // ============================================
  // FEED
  // ============================================
  renderFeed() {
    const user = DB.getCurrentUser();
    if (!user) return;

    // Set avatar on create post
    const feedAvatar = document.getElementById('feed-user-avatar');
    feedAvatar.style.background = user.avatarColor;
    feedAvatar.textContent = this.getInitials(user.name);

    const posts = DB.getAll(DB.KEYS.POSTS);
    const allUsers = DB.getAll(DB.KEYS.USERS);

    // Sort by date desc
    posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const container = document.getElementById('feed-posts');
    container.innerHTML = posts.map(post => this.renderPostCard(post, allUsers, user)).join('');
  },

  renderPostCard(post, allUsers, currentUser) {
    const author = allUsers.find(u => u.id === post.userId);
    if (!author) return '';

    const liked = post.likes.includes(currentUser.id);
    const timeAgo = this.timeAgo(post.timestamp);

    let commentsHTML = '';
    if (post.comments && post.comments.length > 0) {
      commentsHTML = `
        <div class="post-comments">
          ${post.comments.map(c => {
            const commenter = allUsers.find(u => u.id === c.userId);
            if (!commenter) return '';
            return `
              <div class="comment-item">
                <div class="avatar avatar-xs" style="background:${commenter.avatarColor};">${this.getInitials(commenter.name)}</div>
                <div class="comment-body">
                  <span class="comment-author" onclick="App.viewProfile('${commenter.id}')">${commenter.name}</span>
                  <div class="comment-text">${this.escapeHtml(c.content)}</div>
                  <div class="comment-time">${this.timeAgo(c.timestamp)}</div>
                </div>
              </div>`;
          }).join('')}
        </div>`;
    }

    return `
      <div class="post-card glass-card" id="${post.id}">
        <div class="post-header">
          <div class="avatar" style="background:${author.avatarColor}; cursor:pointer;" onclick="App.viewProfile('${author.id}')">
            ${this.getInitials(author.name)}
          </div>
          <div class="post-user-info">
            <div class="post-user-name" onclick="App.viewProfile('${author.id}')">${author.name}</div>
            <div class="post-meta">
              <span>${timeAgo}</span>
              <span>·</span>
              <span class="town-badge">📍 ${author.town}</span>
            </div>
          </div>
        </div>
        <div class="post-content">${this.escapeHtml(post.content)}</div>
        <div class="post-actions-bar">
          <button class="post-action-btn ${liked ? 'liked' : ''}" onclick="App.toggleLike('${post.id}')">
            ${liked ? '❤️' : '🤍'} <span class="count">${post.likes.length}</span>
          </button>
          <button class="post-action-btn" onclick="App.toggleComments('${post.id}')">
            💬 <span class="count">${post.comments ? post.comments.length : 0}</span>
          </button>
        </div>
        ${commentsHTML}
        <div class="comment-input-row">
          <input type="text" id="comment-input-${post.id}" placeholder="Escribe un comentario..." onkeypress="if(event.key==='Enter')App.addComment('${post.id}')">
          <button class="btn btn-ghost btn-sm" onclick="App.addComment('${post.id}')">📤</button>
        </div>
      </div>`;
  },

  createPost() {
    const user = DB.getCurrentUser();
    if (!user) return;
    const input = document.getElementById('new-post-input');
    const content = input.value.trim();
    if (!content) {
      this.showToast('Escribe algo en tu post 📝', 'error');
      return;
    }

    const newPost = {
      id: DB.generateId('post'),
      userId: user.id,
      content: content,
      timestamp: new Date().toISOString(),
      likes: [],
      comments: []
    };

    DB.add(DB.KEYS.POSTS, newPost);
    input.value = '';
    this.renderFeed();
    this.showToast('¡Post publicado! 🎉', 'success');
  },

  toggleLike(postId) {
    const user = DB.getCurrentUser();
    if (!user) return;
    const posts = DB.getAll(DB.KEYS.POSTS);
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const idx = post.likes.indexOf(user.id);
    if (idx >= 0) {
      post.likes.splice(idx, 1);
    } else {
      post.likes.push(user.id);
    }
    DB.save(DB.KEYS.POSTS, posts);
    this.renderFeed();
  },

  addComment(postId) {
    const user = DB.getCurrentUser();
    if (!user) return;
    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();
    if (!content) return;

    const posts = DB.getAll(DB.KEYS.POSTS);
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (!post.comments) post.comments = [];
    post.comments.push({
      userId: user.id,
      content: content,
      timestamp: new Date().toISOString()
    });

    DB.save(DB.KEYS.POSTS, posts);
    input.value = '';
    this.renderFeed();
    this.showToast('Comentario añadido 💬', 'success');
  },

  toggleComments(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    if (input) input.focus();
  },

  // ============================================
  // EVENTS
  // ============================================
  renderEvents() {
    const events = DB.getAll(DB.KEYS.EVENTS);
    const allUsers = DB.getAll(DB.KEYS.USERS);
    const user = DB.getCurrentUser();

    let filtered = events;
    if (this.eventFilter !== 'all') {
      filtered = events.filter(e => e.category === this.eventFilter);
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    const container = document.getElementById('events-list');

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>No hay eventos en esta categoría</h3>
          <p>Prueba con otro filtro</p>
        </div>`;
      return;
    }

    container.innerHTML = filtered.map(event => {
      const dateObj = new Date(event.date);
      const day = dateObj.getDate();
      const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
      const month = months[dateObj.getMonth()];
      const isAttending = event.attendees.includes(user.id);
      const spotsLeft = event.maxCapacity - event.attendees.length;

      // Render attendee avatars (max 4)
      const attendeeAvatars = event.attendees.slice(0, 4).map(aId => {
        const a = allUsers.find(u => u.id === aId);
        if (!a) return '';
        return `<div class="avatar" style="background:${a.avatarColor};">${this.getInitials(a.name)}</div>`;
      }).join('');

      const moreCount = event.attendees.length > 4 ? event.attendees.length - 4 : 0;

      const categoryIcons = {
        musica: '🎵', deporte: '⚽', cultura: '🎭', fiesta: '🎉',
        empleo: '💼', tecnologia: '💻', gastronomia: '🍽️',
        voluntariado: '🤝', mercadillo: '🛍️'
      };

      return `
        <div class="event-card glass-card">
          <div class="event-date-block">
            <div class="day">${day}</div>
            <div class="month">${month}</div>
          </div>
          <div class="event-info">
            <h3>${categoryIcons[event.category] || '📌'} ${this.escapeHtml(event.title)}</h3>
            <p class="event-desc">${this.escapeHtml(event.description)}</p>
            <div class="event-meta-row">
              <span>📍 ${event.location}</span>
              <span>🕐 ${event.time}h</span>
              <span>💰 ${event.price}</span>
              <span>👥 ${spotsLeft} plazas libres</span>
            </div>
            <div class="event-actions">
              <button class="btn ${isAttending ? 'btn-success' : 'btn-outline'} btn-sm" onclick="App.toggleEventAttendance('${event.id}')">
                ${isAttending ? '✅ Apuntad@' : '🙋 Apuntarme'}
              </button>
              <div class="event-attendees">
                ${attendeeAvatars}
                ${moreCount > 0 ? `<div class="more-count">+${moreCount}</div>` : ''}
              </div>
            </div>
          </div>
        </div>`;
    }).join('');
  },

  filterEvents(category) {
    this.eventFilter = category;
    document.querySelectorAll('#events-filters .filter-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.filter === category);
    });
    this.renderEvents();
  },

  toggleEventAttendance(eventId) {
    const user = DB.getCurrentUser();
    if (!user) return;
    const events = DB.getAll(DB.KEYS.EVENTS);
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const idx = event.attendees.indexOf(user.id);
    if (idx >= 0) {
      event.attendees.splice(idx, 1);
      DB.save(DB.KEYS.EVENTS, events);
      this.showToast('Te has desapuntado del evento', 'info');
    } else {
      if (event.attendees.length >= event.maxCapacity) {
        this.showToast('¡No quedan plazas! 😢', 'error');
        return;
      }
      event.attendees.push(user.id);
      DB.save(DB.KEYS.EVENTS, events);
      this.showToast('¡Te has apuntado! 🎉', 'success');
    }
    this.renderEvents();
  },

  // ============================================
  // RIDES
  // ============================================
  renderRides() {
    const rides = DB.getAll(DB.KEYS.RIDES);
    const allUsers = DB.getAll(DB.KEYS.USERS);
    const user = DB.getCurrentUser();

    let filtered = rides;
    if (this.rideFilter === 'teatinos') {
      filtered = rides.filter(r => r.to.toLowerCase().includes('teatinos') || r.from.toLowerCase().includes('teatinos'));
    } else if (this.rideFilter === 'ejido') {
      filtered = rides.filter(r => r.to.toLowerCase().includes('ejido') || r.from.toLowerCase().includes('ejido'));
    }

    // Sort: active rides with available seats first
    filtered.sort((a, b) => {
      if (a.availableSeats > 0 && b.availableSeats === 0) return -1;
      if (a.availableSeats === 0 && b.availableSeats > 0) return 1;
      return new Date(a.date) - new Date(b.date);
    });

    const container = document.getElementById('rides-list');

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🚗</div>
          <h3>No hay viajes disponibles</h3>
          <p>¡Sé el primero en ofrecer uno!</p>
        </div>`;
      return;
    }

    container.innerHTML = filtered.map(ride => {
      const driver = allUsers.find(u => u.id === ride.driverId);
      if (!driver) return '';

      const isDriver = ride.driverId === user.id;
      const isPassenger = ride.passengers.includes(user.id);
      const dateStr = this.formatDate(ride.date);

      // Seats visualization
      let seatsHTML = '';
      for (let i = 0; i < ride.totalSeats; i++) {
        const occupied = i < (ride.totalSeats - ride.availableSeats);
        seatsHTML += `<div class="seat-dot ${occupied ? 'occupied' : 'available'}"></div>`;
      }

      // Passengers chips
      const passengersHTML = ride.passengers.map(pId => {
        const p = allUsers.find(u => u.id === pId);
        if (!p) return '';
        return `
          <div class="ride-passenger-chip">
            <div class="avatar avatar-xs" style="background:${p.avatarColor};">${this.getInitials(p.name)}</div>
            ${p.name.split(' ')[0]}
          </div>`;
      }).join('');

      // Recurrent days
      const allDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
      const daysHTML = ride.recurrent ? `
        <div class="recurrent-days">
          ${allDays.map(d => `
            <div class="day-chip ${ride.recurrentDays.includes(d) ? 'active' : ''}">${d}</div>
          `).join('')}
        </div>` : '';

      return `
        <div class="ride-card glass-card">
          <div class="ride-route">
            <div class="ride-point">
              <div class="point-dot"></div>
              <span class="point-label">Origen</span>
            </div>
            <div class="ride-line"></div>
            <div class="ride-point destination">
              <div class="point-dot"></div>
              <span class="point-label">Destino</span>
            </div>
          </div>

          <div class="ride-locations">
            <div class="ride-location-name">${this.escapeHtml(ride.from)}</div>
            <div class="ride-location-name to">${this.escapeHtml(ride.to)}</div>
          </div>

          <div class="ride-details">
            <div class="ride-detail-item">
              <div class="detail-icon">📅</div>
              <div class="detail-value">${dateStr}</div>
              <div class="detail-label">Fecha</div>
            </div>
            <div class="ride-detail-item">
              <div class="detail-icon">🕐</div>
              <div class="detail-value">${ride.departureTime}h</div>
              <div class="detail-label">Salida</div>
            </div>
            <div class="ride-detail-item">
              <div class="detail-icon">${ride.returnTime ? '🔄' : '➡️'}</div>
              <div class="detail-value">${ride.returnTime || 'N/A'}</div>
              <div class="detail-label">Vuelta</div>
            </div>
            <div class="ride-detail-item">
              <div class="detail-icon">💰</div>
              <div class="detail-value">${ride.price.toFixed(2)}€</div>
              <div class="detail-label">Por persona</div>
            </div>
          </div>

          <div class="ride-driver">
            <div class="avatar" style="background:${driver.avatarColor}; cursor:pointer;" onclick="App.viewProfile('${driver.id}')">
              ${this.getInitials(driver.name)}
            </div>
            <div class="driver-info">
              <div class="driver-name">${driver.name} ${isDriver ? '(Tú)' : ''}</div>
              <div class="driver-degree">${driver.degree} · ${driver.campus}</div>
            </div>
            ${!isDriver ? `<button class="btn btn-ghost btn-sm" onclick="App.openChatWith('${driver.id}')">✉️</button>` : ''}
          </div>

          ${ride.notes ? `<div class="ride-notes">💡 ${this.escapeHtml(ride.notes)}</div>` : ''}

          ${ride.passengers.length > 0 ? `
            <div class="ride-passengers">
              <div class="ride-passengers-title">👥 Pasajeros (${ride.passengers.length}/${ride.totalSeats})</div>
              <div class="ride-passengers-list">${passengersHTML}</div>
            </div>` : ''}

          <div class="ride-footer">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <div class="seats-indicator">${seatsHTML}</div>
                <span style="font-size:0.78rem; color:${ride.availableSeats > 0 ? 'var(--success)' : 'var(--error)'}; font-weight:600;">
                  ${ride.availableSeats > 0 ? `${ride.availableSeats} plaza${ride.availableSeats > 1 ? 's' : ''} libre${ride.availableSeats > 1 ? 's' : ''}` : 'Completo'}
                </span>
              </div>
              ${daysHTML}
            </div>
            <div>
              ${!isDriver && !isPassenger && ride.availableSeats > 0 ? `
                <button class="btn btn-accent btn-sm" onclick="App.bookRide('${ride.id}')">
                  🎟️ Reservar plaza
                </button>` : ''}
              ${isPassenger ? `
                <button class="btn btn-danger btn-sm" onclick="App.cancelRide('${ride.id}')">
                  ❌ Cancelar reserva
                </button>` : ''}
              ${isDriver ? `
                <span class="badge badge-primary">🚗 Tu viaje</span>` : ''}
            </div>
          </div>
        </div>`;
    }).join('');
  },

  filterRides(filter) {
    this.rideFilter = filter;
    this.renderRides();
  },

  bookRide(rideId) {
    const user = DB.getCurrentUser();
    if (!user) return;

    const rides = DB.getAll(DB.KEYS.RIDES);
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;

    if (ride.availableSeats <= 0) {
      this.showToast('¡No quedan plazas disponibles! 😢', 'error');
      return;
    }

    if (ride.passengers.includes(user.id)) {
      this.showToast('Ya tienes reserva en este viaje', 'info');
      return;
    }

    ride.passengers.push(user.id);
    ride.availableSeats--;
    DB.save(DB.KEYS.RIDES, rides);

    // Send notification to driver
    const driver = DB.getById(DB.KEYS.USERS, ride.driverId);
    this.addNotification(ride.driverId, 'ride_request', user.id,
      `${user.name} ha reservado una plaza en tu viaje ${ride.from} → ${ride.to}`, rideId);

    // Send auto message
    this.addMessageAuto(user.id, ride.driverId,
      `¡Hola! He reservado una plaza en tu viaje de ${ride.from} a ${ride.to} del ${this.formatDate(ride.date)} a las ${ride.departureTime}. ¡Nos vemos! 😊`);

    this.renderRides();
    this.showToast('¡Plaza reservada! 🎉 Se ha enviado un mensaje al conductor.', 'success');
  },

  cancelRide(rideId) {
    const user = DB.getCurrentUser();
    if (!user) return;

    const rides = DB.getAll(DB.KEYS.RIDES);
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;

    const idx = ride.passengers.indexOf(user.id);
    if (idx >= 0) {
      ride.passengers.splice(idx, 1);
      ride.availableSeats++;
      DB.save(DB.KEYS.RIDES, rides);

      this.addMessageAuto(user.id, ride.driverId,
        `He tenido que cancelar mi reserva del viaje ${ride.from} → ${ride.to} del ${this.formatDate(ride.date)}. ¡Lo siento!`);

      this.renderRides();
      this.showToast('Reserva cancelada. Se ha notificado al conductor.', 'info');
    }
  },

  openCreateRideModal() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const modal = document.getElementById('create-ride-modal');
    modal.classList.add('show');

    // Populate towns
    const fromSelect = document.getElementById('ride-from');
    fromSelect.innerHTML = `<option value="">Selecciona tu pueblo/ciudad</option>` +
      DB.towns.map(t => `<option value="${t.name}" ${t.name === user.town ? 'selected' : ''}>${t.name} (${t.distance} km)</option>`).join('');

    // Populate campuses
    const toSelect = document.getElementById('ride-to');
    toSelect.innerHTML = `<option value="">Selecciona campus</option>` +
      DB.campuses.map(c => `<option value="${c}">${c}</option>`).join('');

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('ride-date').value = tomorrow.toISOString().split('T')[0];
    document.getElementById('ride-departure').value = '07:30';
    document.getElementById('ride-return').value = '14:30';
    document.getElementById('ride-price').value = '2.00';
    document.getElementById('ride-notes').value = '';
  },

  closeCreateRideModal() {
    document.getElementById('create-ride-modal').classList.remove('show');
  },

  createRide() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const from = document.getElementById('ride-from').value;
    const to = document.getElementById('ride-to').value;
    const date = document.getElementById('ride-date').value;
    const departure = document.getElementById('ride-departure').value;
    const returnTime = document.getElementById('ride-return').value;
    const seats = parseInt(document.getElementById('ride-seats').value);
    const price = parseFloat(document.getElementById('ride-price').value) || 0;
    const notes = document.getElementById('ride-notes').value.trim();

    if (!from || !to || !date || !departure) {
      this.showToast('Rellena al menos origen, destino, fecha y hora de salida', 'error');
      return;
    }

    const selectedDays = [];
    document.querySelectorAll('#ride-days label.selected').forEach(label => {
      selectedDays.push(label.dataset.day);
    });

    const newRide = {
      id: DB.generateId('ride'),
      driverId: user.id,
      from: from,
      to: to,
      date: date,
      departureTime: departure,
      returnTime: returnTime || null,
      totalSeats: seats,
      availableSeats: seats,
      passengers: [],
      price: price,
      notes: notes,
      recurrent: selectedDays.length > 0,
      recurrentDays: selectedDays,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    DB.add(DB.KEYS.RIDES, newRide);
    this.closeCreateRideModal();
    this.renderRides();
    this.showToast('¡Viaje publicado! 🚗 Tus compañeros ya pueden reservar.', 'success');
  },

  // ============================================
  // MESSAGES
  // ============================================
  renderMessages() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const messages = DB.getAll(DB.KEYS.MESSAGES);
    const allUsers = DB.getAll(DB.KEYS.USERS);

    // Get unique conversations
    const conversations = {};
    messages.forEach(msg => {
      const otherId = msg.fromId === user.id ? msg.toId : (msg.toId === user.id ? msg.fromId : null);
      if (!otherId) return;

      if (!conversations[otherId]) {
        conversations[otherId] = {
          userId: otherId,
          lastMessage: msg,
          unread: 0
        };
      }

      if (new Date(msg.timestamp) > new Date(conversations[otherId].lastMessage.timestamp)) {
        conversations[otherId].lastMessage = msg;
      }

      if (msg.toId === user.id && !msg.read) {
        conversations[otherId].unread++;
      }
    });

    const sortedConvos = Object.values(conversations).sort(
      (a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
    );

    const contactsContainer = document.getElementById('messages-contacts');
    contactsContainer.innerHTML = sortedConvos.map(convo => {
      const contact = allUsers.find(u => u.id === convo.userId);
      if (!contact) return '';
      const isActive = this.currentChatUser === convo.userId;

      return `
        <button class="message-contact ${isActive ? 'active' : ''}" onclick="App.openChat('${contact.id}')">
          <div class="avatar avatar-sm" style="background:${contact.avatarColor};">
            ${this.getInitials(contact.name)}
          </div>
          <div class="contact-info">
            <div class="contact-name">${contact.name}</div>
            <div class="contact-preview">${this.escapeHtml(convo.lastMessage.content).substring(0, 40)}...</div>
          </div>
          ${convo.unread > 0 ? '<div class="unread-dot"></div>' : ''}
        </button>`;
    }).join('');

    // Also add friends without conversations
    const friendsWithoutConvo = user.friends.filter(fId => !conversations[fId]);
    if (friendsWithoutConvo.length > 0) {
      contactsContainer.innerHTML += `
        <div style="margin-top:16px; padding-top:12px; border-top:1px solid var(--border-color);">
          <div style="font-size:0.7rem; color:var(--text-muted); padding:4px 12px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px;">Amigos</div>
          ${friendsWithoutConvo.map(fId => {
            const f = allUsers.find(u => u.id === fId);
            if (!f) return '';
            return `
              <button class="message-contact" onclick="App.openChat('${f.id}')">
                <div class="avatar avatar-sm" style="background:${f.avatarColor};">${this.getInitials(f.name)}</div>
                <div class="contact-info">
                  <div class="contact-name">${f.name}</div>
                  <div class="contact-preview" style="color:var(--text-muted);">Iniciar conversación</div>
                </div>
              </button>`;
          }).join('')}
        </div>`;
    }

    if (this.currentChatUser) {
      this.renderChat(this.currentChatUser);
    }
  },

  openChat(userId) {
    this.currentChatUser = userId;

    // Mobile: show chat, hide list
    document.getElementById('messages-list-panel').classList.remove('mobile-show');
    document.getElementById('messages-chat-panel').classList.remove('mobile-hidden');
    document.getElementById('chat-back-btn').style.display = window.innerWidth <= 768 ? 'block' : 'none';

    this.renderChat(userId);
    this.renderMessages();

    // Mark messages as read
    const user = DB.getCurrentUser();
    const messages = DB.getAll(DB.KEYS.MESSAGES);
    let changed = false;
    messages.forEach(msg => {
      if (msg.fromId === userId && msg.toId === user.id && !msg.read) {
        msg.read = true;
        changed = true;
      }
    });
    if (changed) {
      DB.save(DB.KEYS.MESSAGES, messages);
      this.updateNotificationBadges();
    }
  },

  renderChat(userId) {
    const user = DB.getCurrentUser();
    const allUsers = DB.getAll(DB.KEYS.USERS);
    const chatUser = allUsers.find(u => u.id === userId);
    if (!chatUser) return;

    document.getElementById('chat-empty').style.display = 'none';
    const chatActive = document.getElementById('chat-active');
    chatActive.style.display = 'flex';

    // Chat header
    document.getElementById('chat-avatar').style.background = chatUser.avatarColor;
    document.getElementById('chat-avatar').textContent = this.getInitials(chatUser.name);
    document.getElementById('chat-user-name').textContent = chatUser.name;
    document.getElementById('chat-user-town').textContent = `📍 ${chatUser.town}`;

    // Chat messages
    const messages = DB.getAll(DB.KEYS.MESSAGES);
    const conversation = messages.filter(
      m => (m.fromId === user.id && m.toId === userId) ||
           (m.fromId === userId && m.toId === user.id)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const container = document.getElementById('chat-messages');
    container.innerHTML = conversation.map(msg => {
      const isSent = msg.fromId === user.id;
      const time = new Date(msg.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      return `
        <div class="chat-bubble ${isSent ? 'sent' : 'received'}">
          ${this.escapeHtml(msg.content)}
          <div class="bubble-time">${time}</div>
        </div>`;
    }).join('');

    container.scrollTop = container.scrollHeight;

    // Focus input
    setTimeout(() => document.getElementById('chat-input').focus(), 100);
  },

  sendMessage() {
    const user = DB.getCurrentUser();
    if (!user || !this.currentChatUser) return;

    const input = document.getElementById('chat-input');
    const content = input.value.trim();
    if (!content) return;

    const newMsg = {
      id: DB.generateId('msg'),
      fromId: user.id,
      toId: this.currentChatUser,
      content: content,
      timestamp: new Date().toISOString(),
      read: false
    };

    DB.add(DB.KEYS.MESSAGES, newMsg);
    input.value = '';
    this.renderChat(this.currentChatUser);
    this.renderMessages();
  },

  addMessageAuto(fromId, toId, content) {
    const newMsg = {
      id: DB.generateId('msg'),
      fromId: fromId,
      toId: toId,
      content: content,
      timestamp: new Date().toISOString(),
      read: false
    };
    DB.add(DB.KEYS.MESSAGES, newMsg);
    this.updateNotificationBadges();
  },

  showMessagesList() {
    document.getElementById('messages-list-panel').classList.add('mobile-show');
    document.getElementById('messages-chat-panel').classList.add('mobile-hidden');
    document.getElementById('chat-active').style.display = 'none';
    document.getElementById('chat-empty').style.display = 'flex';
    this.currentChatUser = null;
  },

  openChatWith(userId) {
    this.navigateTo('messages');
    setTimeout(() => this.openChat(userId), 100);
  },

  // ============================================
  // FRIENDS
  // ============================================
  renderFriends() {
    const user = DB.getCurrentUser();
    if (!user) return;
    const allUsers = DB.getAll(DB.KEYS.USERS);

    // Friend requests
    const requestSection = document.getElementById('friend-requests-section');
    const requestsList = document.getElementById('friend-requests-list');

    if (user.friendRequests && user.friendRequests.length > 0) {
      requestSection.style.display = 'block';
      requestsList.innerHTML = user.friendRequests.map(reqId => {
        const requester = allUsers.find(u => u.id === reqId);
        if (!requester) return '';
        return `
          <div class="friend-card glass-card">
            <div class="avatar avatar-lg" style="background:${requester.avatarColor}; margin:0 auto;">
              ${this.getInitials(requester.name)}
            </div>
            <div class="friend-name">${requester.name}</div>
            <div class="friend-town">📍 ${requester.town}</div>
            <div class="friend-degree">${requester.degree}</div>
            <div class="friend-actions">
              <button class="btn btn-success btn-sm" onclick="App.acceptFriendRequest('${requester.id}')">✅ Aceptar</button>
              <button class="btn btn-outline btn-sm" onclick="App.rejectFriendRequest('${requester.id}')">❌</button>
            </div>
          </div>`;
      }).join('');
    } else {
      requestSection.style.display = 'none';
    }

    // Current friends
    const friends = allUsers.filter(u => user.friends.includes(u.id));
    const friendsList = document.getElementById('friends-list');
    friendsList.innerHTML = friends.map(f => `
      <div class="friend-card glass-card">
        <div class="avatar avatar-lg" style="background:${f.avatarColor}; margin:0 auto; cursor:pointer;" onclick="App.viewProfile('${f.id}')">
          ${this.getInitials(f.name)}
          ${f.online ? '<div class="online-dot"></div>' : ''}
        </div>
        <div class="friend-name">${f.name}</div>
        <div class="friend-town">📍 ${f.town}</div>
        <div class="friend-degree">${f.degree}</div>
        <div class="friend-actions">
          <button class="btn btn-outline btn-sm" onclick="App.viewProfile('${f.id}')">👤 Perfil</button>
          <button class="btn btn-primary btn-sm" onclick="App.openChatWith('${f.id}')">✉️</button>
        </div>
      </div>
    `).join('');

    // Suggested friends
    const suggested = allUsers.filter(u =>
      u.id !== user.id &&
      !user.friends.includes(u.id) &&
      !(user.friendRequests || []).includes(u.id)
    );

    const suggestedContainer = document.getElementById('suggested-friends');
    suggestedContainer.innerHTML = suggested.map(s => `
      <div class="friend-card glass-card">
        <div class="avatar avatar-lg" style="background:${s.avatarColor}; margin:0 auto;">
          ${this.getInitials(s.name)}
        </div>
        <div class="friend-name">${s.name}</div>
        <div class="friend-town">📍 ${s.town}</div>
        <div class="friend-degree">${s.degree}</div>
        <div class="friend-actions">
          <button class="btn btn-accent btn-sm" onclick="App.sendFriendRequest('${s.id}')">➕ Añadir</button>
          <button class="btn btn-outline btn-sm" onclick="App.viewProfile('${s.id}')">👤</button>
        </div>
      </div>
    `).join('');
  },

  sendFriendRequest(targetId) {
    const user = DB.getCurrentUser();
    if (!user) return;

    const users = DB.getAll(DB.KEYS.USERS);
    const target = users.find(u => u.id === targetId);
    if (!target) return;

    if (!target.friendRequests) target.friendRequests = [];
    if (!target.friendRequests.includes(user.id)) {
      target.friendRequests.push(user.id);
      DB.save(DB.KEYS.USERS, users);
      this.addNotification(targetId, 'friend_request', user.id,
        `${user.name} quiere ser tu amig@`, null);
      this.showToast(`Solicitud enviada a ${target.name.split(' ')[0]} 📩`, 'success');
      this.renderFriends();
    }
  },

  acceptFriendRequest(requesterId) {
    const users = DB.getAll(DB.KEYS.USERS);
    const user = users.find(u => u.id === DB.getSession());
    const requester = users.find(u => u.id === requesterId);
    if (!user || !requester) return;

    // Add each other as friends
    if (!user.friends.includes(requesterId)) user.friends.push(requesterId);
    if (!requester.friends.includes(user.id)) requester.friends.push(user.id);

    // Remove request
    user.friendRequests = (user.friendRequests || []).filter(id => id !== requesterId);

    DB.save(DB.KEYS.USERS, users);
    this.renderFriends();
    this.renderSidebarFriends();
    this.showToast(`¡Ahora eres amig@ de ${requester.name.split(' ')[0]}! 🎉`, 'success');
  },

  rejectFriendRequest(requesterId) {
    const users = DB.getAll(DB.KEYS.USERS);
    const user = users.find(u => u.id === DB.getSession());
    if (!user) return;

    user.friendRequests = (user.friendRequests || []).filter(id => id !== requesterId);
    DB.save(DB.KEYS.USERS, users);
    this.renderFriends();
    this.showToast('Solicitud rechazada', 'info');
  },

  // ============================================
  // PROFILE
  // ============================================
  renderProfile(userId) {
    const currentUser = DB.getCurrentUser();
    if (!currentUser) return;

    const profileUserId = userId || this.currentProfileUser || currentUser.id;
    const allUsers = DB.getAll(DB.KEYS.USERS);
    const profileUser = allUsers.find(u => u.id === profileUserId);
    if (!profileUser) return;

    this.currentProfileUser = profileUserId;
    const isOwnProfile = profileUserId === currentUser.id;

    // Avatar
    const avatar = document.getElementById('profile-avatar');
    avatar.style.background = profileUser.avatarColor;
    avatar.textContent = this.getInitials(profileUser.name);

    // Basic info
    document.getElementById('profile-name').textContent = profileUser.name;
    document.getElementById('profile-username').textContent = `@${profileUser.username}`;
    document.getElementById('profile-bio').textContent = profileUser.bio;

    // Details
    document.getElementById('profile-details').innerHTML = `
      <span>📍 ${profileUser.town}</span>
      <span>🎓 ${profileUser.university}</span>
      <span>📚 ${profileUser.degree} · ${profileUser.year}º año</span>
      <span>🏛️ Campus ${profileUser.campus}</span>
      <span>📅 Desde ${this.formatDate(profileUser.joinDate)}</span>
    `;

    // Stats
    const posts = DB.getAll(DB.KEYS.POSTS).filter(p => p.userId === profileUserId);
    const rides = DB.getAll(DB.KEYS.RIDES).filter(r => r.driverId === profileUserId);

    document.getElementById('profile-stats').innerHTML = `
      <div class="profile-stat">
        <div class="stat-value">${profileUser.friends.length}</div>
        <div class="stat-label">Amigos</div>
      </div>
      <div class="profile-stat">
        <div class="stat-value">${posts.length}</div>
        <div class="stat-label">Posts</div>
      </div>
      <div class="profile-stat">
        <div class="stat-value">${rides.length}</div>
        <div class="stat-label">Viajes</div>
      </div>
    `;

    // Content: show posts by default
    this.switchProfileTab('posts');
  },

  viewProfile(userId) {
    this.currentProfileUser = userId;
    this.navigateTo('profile');
    this.renderProfile(userId);
  },

  switchProfileTab(tab) {
    document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
    event?.target?.classList?.add('active');

    const userId = this.currentProfileUser || DB.getSession();
    const allUsers = DB.getAll(DB.KEYS.USERS);
    const user = allUsers.find(u => u.id === userId);
    const currentUser = DB.getCurrentUser();
    const container = document.getElementById('profile-content');

    if (tab === 'posts') {
      const posts = DB.getAll(DB.KEYS.POSTS).filter(p => p.userId === userId);
      posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      if (posts.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">📝</div>
            <h3>Sin publicaciones aún</h3>
          </div>`;
      } else {
        container.innerHTML = posts.map(p => this.renderPostCard(p, allUsers, currentUser)).join('');
      }
    } else if (tab === 'rides') {
      const rides = DB.getAll(DB.KEYS.RIDES).filter(r => r.driverId === userId);
      if (rides.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">🚗</div>
            <h3>No ha publicado viajes</h3>
          </div>`;
      } else {
        container.innerHTML = `<div id="rides-list">${rides.map(r => {
          const driver = allUsers.find(u => u.id === r.driverId);
          return `
            <div class="ride-card glass-card" style="margin-bottom:12px;">
              <div class="ride-locations" style="margin-bottom:8px;">
                <div class="ride-location-name">${r.from}</div>
                <div style="color:var(--text-muted);">→</div>
                <div class="ride-location-name to">${r.to}</div>
              </div>
              <div style="font-size:0.82rem; color:var(--text-secondary);">
                📅 ${this.formatDate(r.date)} · 🕐 ${r.departureTime}h · 💰 ${r.price.toFixed(2)}€ · 💺 ${r.availableSeats} plazas
              </div>
            </div>`;
        }).join('')}</div>`;
      }
    } else if (tab === 'info') {
      container.innerHTML = `
        <div class="glass-card" style="padding:24px;">
          <h3 style="margin-bottom:16px;">ℹ️ Información</h3>
          <div style="display:flex; flex-direction:column; gap:12px; font-size:0.9rem;">
            <div><strong>Nombre:</strong> ${user.name}</div>
            <div><strong>Usuario:</strong> @${user.username}</div>
            <div><strong>Pueblo:</strong> ${user.town}</div>
            <div><strong>Universidad:</strong> ${user.university}</div>
            <div><strong>Campus:</strong> ${user.campus}</div>
            <div><strong>Carrera:</strong> ${user.degree}</div>
            <div><strong>Año:</strong> ${user.year}º</div>
            <div><strong>Miembro desde:</strong> ${this.formatDate(user.joinDate)}</div>
            <div><strong>Bio:</strong> ${user.bio}</div>
          </div>
        </div>`;
    }
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================
  renderNotifications() {
    const user = DB.getCurrentUser();
    if (!user) return;

    const notifications = DB.getAll(DB.KEYS.NOTIFICATIONS)
      .filter(n => n.userId === user.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const container = document.getElementById('notifications-list');

    if (notifications.length === 0) {
      container.innerHTML = `
        <div style="padding:40px; text-align:center; color:var(--text-muted);">
          <div style="font-size:2rem; margin-bottom:8px;">🔔</div>
          <p>No tienes notificaciones</p>
        </div>`;
      return;
    }

    const allUsers = DB.getAll(DB.KEYS.USERS);
    container.innerHTML = notifications.map(notif => {
      const iconMap = {
        like: { icon: '❤️', class: 'like' },
        comment: { icon: '💬', class: 'comment' },
        ride_request: { icon: '🚗', class: 'ride' },
        friend_request: { icon: '👥', class: 'friend' },
        event: { icon: '📋', class: 'event' }
      };
      const { icon, class: cls } = iconMap[notif.type] || { icon: '📌', class: 'event' };

      return `
        <div class="notification-item ${notif.read ? '' : 'unread'}" onclick="App.handleNotifClick('${notif.id}')">
          <div class="notif-icon ${cls}">${icon}</div>
          <div>
            <div class="notif-text">${this.escapeHtml(notif.message)}</div>
            <div class="notif-time">${this.timeAgo(notif.timestamp)}</div>
          </div>
        </div>`;
    }).join('');
  },

  handleNotifClick(notifId) {
    const notifications = DB.getAll(DB.KEYS.NOTIFICATIONS);
    const notif = notifications.find(n => n.id === notifId);
    if (notif) {
      notif.read = true;
      DB.save(DB.KEYS.NOTIFICATIONS, notifications);
      this.updateNotificationBadges();
      this.renderNotifications();
    }
  },

  markAllNotifsRead() {
    const user = DB.getCurrentUser();
    if (!user) return;
    const notifications = DB.getAll(DB.KEYS.NOTIFICATIONS);
    notifications.forEach(n => {
      if (n.userId === user.id) n.read = true;
    });
    DB.save(DB.KEYS.NOTIFICATIONS, notifications);
    this.updateNotificationBadges();
    this.renderNotifications();
    this.showToast('Notificaciones marcadas como leídas ✓', 'info');
  },

  addNotification(userId, type, fromUserId, message, relatedId) {
    const notif = {
      id: DB.generateId('notif'),
      userId: userId,
      type: type,
      fromUserId: fromUserId,
      message: message,
      relatedId: relatedId,
      timestamp: new Date().toISOString(),
      read: false
    };
    DB.add(DB.KEYS.NOTIFICATIONS, notif);
  },

  updateNotificationBadges() {
    const user = DB.getCurrentUser();
    if (!user) return;

    // Notifications
    const notifications = DB.getAll(DB.KEYS.NOTIFICATIONS);
    const unreadNotifs = notifications.filter(n => n.userId === user.id && !n.read).length;
    const notifBadge = document.getElementById('notif-badge');
    if (unreadNotifs > 0) {
      notifBadge.style.display = 'flex';
      notifBadge.textContent = unreadNotifs > 9 ? '9+' : unreadNotifs;
    } else {
      notifBadge.style.display = 'none';
    }

    // Messages
    const messages = DB.getAll(DB.KEYS.MESSAGES);
    const unreadMsgs = messages.filter(m => m.toId === user.id && !m.read).length;
    const msgBadge = document.getElementById('msg-badge');
    const mobileMsg = document.getElementById('mobile-msg-badge');
    const navMsg = document.getElementById('messages-nav-badge');

    [msgBadge, mobileMsg, navMsg].forEach(badge => {
      if (badge) {
        if (unreadMsgs > 0) {
          badge.style.display = 'flex';
          badge.textContent = unreadMsgs > 9 ? '9+' : unreadMsgs;
        } else {
          badge.style.display = 'none';
        }
      }
    });
  },

  // ============================================
  // SEARCH
  // ============================================
  handleSearch(query) {
    if (!query.trim()) {
      // Return to current page
      this.navigateTo(this.currentPage);
      return;
    }

    query = query.toLowerCase();
    const allUsers = DB.getAll(DB.KEYS.USERS);
    const rides = DB.getAll(DB.KEYS.RIDES);
    const events = DB.getAll(DB.KEYS.EVENTS);

    const matchedUsers = allUsers.filter(u =>
      u.name.toLowerCase().includes(query) ||
      u.town.toLowerCase().includes(query) ||
      u.degree.toLowerCase().includes(query)
    );

    const matchedRides = rides.filter(r =>
      r.from.toLowerCase().includes(query) ||
      r.to.toLowerCase().includes(query)
    );

    const matchedEvents = events.filter(e =>
      e.title.toLowerCase().includes(query) ||
      e.description.toLowerCase().includes(query) ||
      e.location.toLowerCase().includes(query)
    );

    // Show results in feed area
    const feedSection = document.getElementById('section-feed');
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    feedSection.classList.add('active');

    const container = document.getElementById('feed-posts');
    let html = `<div class="section-header"><h2>🔍 Resultados para "${this.escapeHtml(query)}"</h2></div>`;

    if (matchedUsers.length > 0) {
      html += `<h3 style="margin:16px 0 12px; font-size:0.9rem; color:var(--text-secondary);">👥 Personas</h3>`;
      html += `<div class="friends-grid" style="margin-bottom:20px;">`;
      html += matchedUsers.map(u => `
        <div class="friend-card glass-card">
          <div class="avatar avatar-lg" style="background:${u.avatarColor}; margin:0 auto; cursor:pointer;" onclick="App.viewProfile('${u.id}')">
            ${this.getInitials(u.name)}
          </div>
          <div class="friend-name">${u.name}</div>
          <div class="friend-town">📍 ${u.town}</div>
          <div class="friend-degree">${u.degree}</div>
        </div>`).join('');
      html += `</div>`;
    }

    if (matchedEvents.length > 0) {
      html += `<h3 style="margin:16px 0 12px; font-size:0.9rem; color:var(--text-secondary);">📋 Eventos</h3>`;
      matchedEvents.forEach(e => {
        html += `<div class="glass-card" style="padding:16px; margin-bottom:12px; cursor:pointer;" onclick="App.navigateTo('events')">
          <strong>${e.title}</strong><br>
          <span style="font-size:0.82rem; color:var(--text-muted);">📍 ${e.location} · 📅 ${this.formatDate(e.date)}</span>
        </div>`;
      });
    }

    if (matchedRides.length > 0) {
      html += `<h3 style="margin:16px 0 12px; font-size:0.9rem; color:var(--text-secondary);">🚗 Viajes</h3>`;
      matchedRides.forEach(r => {
        html += `<div class="glass-card" style="padding:16px; margin-bottom:12px; cursor:pointer;" onclick="App.navigateTo('rides')">
          <strong>${r.from} → ${r.to}</strong><br>
          <span style="font-size:0.82rem; color:var(--text-muted);">📅 ${this.formatDate(r.date)} · 🕐 ${r.departureTime}h · 💺 ${r.availableSeats} plazas</span>
        </div>`;
      });
    }

    if (matchedUsers.length === 0 && matchedEvents.length === 0 && matchedRides.length === 0) {
      html += `<div class="empty-state"><div class="empty-icon">🔍</div><h3>Sin resultados</h3><p>Prueba con otra búsqueda</p></div>`;
    }

    container.innerHTML = html;
  },

  // ============================================
  // DATA RESET
  // ============================================
  resetData() {
    if (confirm('¿Seguro que quieres resetear todos los datos? Se perderán los cambios.')) {
      DB.resetAll();
      this.closeDropdowns();
      this.navigateTo('feed');
      this.renderSidebarFriends();
      this.updateNotificationBadges();
      this.showToast('Datos reseteados a valores iniciales 🔄', 'info');
    }
  },

  // ============================================
  // UTILITIES
  // ============================================
  getInitials(name) {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  timeAgo(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'ahora';
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `hace ${Math.floor(seconds / 86400)} día${Math.floor(seconds / 86400) > 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  },

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

// ---- Bootstrap ----
document.addEventListener('DOMContentLoaded', () => App.init());
