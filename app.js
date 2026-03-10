/* ============================================================
   SubletSync — app.js  v2
   Shared Supabase client, data layer, utilities, nav renderer
   ============================================================ */

// ── Supabase Config ──────────────────────────────────────────
// REPLACE these two values with your own from supabase.com/dashboard
const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON = 'YOUR_ANON_PUBLIC_KEY_HERE';

let _supabase = null;
function getSupabase() {
  if (_supabase) return _supabase;
  try {
    if (typeof supabase !== 'undefined' && !SUPABASE_URL.includes('YOUR')) {
      _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    }
  } catch (e) { /* demo mode */ }
  return _supabase;
}

// ── Demo Data ─────────────────────────────────────────────────
const DEMO_LISTINGS = [
  {
    id: 'demo-1',
    title: 'Bright Studio Near UT Campus',
    address: '2106 San Antonio St',
    city: 'Austin', state: 'TX',
    price: 850, bedrooms: 0, bathrooms: 1, sqft: 420,
    description: 'Cozy, light-filled studio just 4 blocks from the UT Tower. Hardwood floors, updated kitchen, huge windows. Perfect for a grad student or summer intern. Walking distance to the Drag, Whole Foods, and great coffee shops. Very quiet building with respectful neighbors. All utilities included — just bring your laptop and move in.',
    available_from: '2026-05-15', available_to: '2026-08-15',
    furnished: true, sublease_type: 'whole_unit',
    amenities: ['WiFi', 'AC', 'Furnished', 'Utilities Included'],
    photos: [],
    lister_id: 'demo-user-1', lister_name: 'Maya Patel',
    lister_email: 'mpatel@utexas.edu', lister_university: 'UT Austin', lister_grad_year: 2026,
    trust_score: 92, created_at: '2026-02-10T14:30:00Z', status: 'active'
  },
  {
    id: 'demo-2',
    title: 'Modern 1BR in West Campus',
    address: '801 W 24th St, Apt 4B',
    city: 'Austin', state: 'TX',
    price: 1150, bedrooms: 1, bathrooms: 1, sqft: 680,
    description: 'Beautiful one-bedroom in the heart of West Campus. Open floor plan, stainless appliances, private balcony with city views. Building has rooftop access, gym, and secure parking garage. In-unit washer/dryer included. Lease transfer available — landlord approval required. Showing by appointment.',
    available_from: '2026-05-01', available_to: '2026-07-31',
    furnished: false, sublease_type: 'whole_unit',
    amenities: ['WiFi', 'Parking', 'In-unit W/D', 'AC', 'Gym', 'Rooftop'],
    photos: [],
    lister_id: 'demo-user-2', lister_name: 'James Okonkwo',
    lister_email: 'jokonkwo@utexas.edu', lister_university: 'UT Austin', lister_grad_year: 2027,
    trust_score: 88, created_at: '2026-02-14T09:15:00Z', status: 'active'
  },
  {
    id: 'demo-3',
    title: 'Private Room in 3BR Hyde Park House',
    address: '4512 Ave G',
    city: 'Austin', state: 'TX',
    price: 620, bedrooms: 1, bathrooms: 1, sqft: 180,
    description: "Private furnished room in a charming Hyde Park craftsman house. Two super friendly roommates (both grad students). Shared kitchen, living room, and backyard. Street parking available. Bikes welcome. The neighborhood is amazing — coffee shops, Quack's Bakery, Shipe Pool all walkable.",
    available_from: '2026-06-01', available_to: '2026-08-31',
    furnished: true, sublease_type: 'private_room',
    amenities: ['WiFi', 'Pet-friendly', 'Furnished', 'AC'],
    photos: [],
    lister_id: 'demo-user-3', lister_name: 'Sofia Reyes',
    lister_email: 'sreyes@utexas.edu', lister_university: 'UT Austin', lister_grad_year: 2026,
    trust_score: 95, created_at: '2026-02-18T16:45:00Z', status: 'active'
  },
  {
    id: 'demo-4',
    title: 'Spacious 2BR Near Riverside',
    address: '1717 Willow Creek Dr, Unit 201',
    city: 'Austin', state: 'TX',
    price: 1400, bedrooms: 2, bathrooms: 2, sqft: 950,
    description: "Gorgeous corner unit with floor-to-ceiling windows and a stunning view of Lady Bird Lake. Two full bedrooms, two full baths — perfect for two friends subletting together. Resort-style pool, fitness center, and 24/7 concierge. Walking distance to Barton Springs Greenbelt.",
    available_from: '2026-05-15', available_to: '2026-08-15',
    furnished: true, sublease_type: 'whole_unit',
    amenities: ['WiFi', 'Parking', 'Pool', 'Gym', 'In-unit W/D', 'AC', 'Furnished'],
    photos: [],
    lister_id: 'demo-user-4', lister_name: 'Derek Huang',
    lister_email: 'dhuang@utexas.edu', lister_university: 'UT Austin', lister_grad_year: 2025,
    trust_score: 79, created_at: '2026-02-20T11:00:00Z', status: 'active'
  },
  {
    id: 'demo-5',
    title: 'Cozy Room — North Loop Bungalow',
    address: '52 East 53rd St',
    city: 'Austin', state: 'TX',
    price: 550, bedrooms: 1, bathrooms: 1, sqft: 160,
    description: 'Cute private room in a sun-drenched North Loop bungalow. One other roommate, very chill. Great vintage coffee shops, thrift stores, and Thai food nearby. Quiet street, tons of shade. Perfect if you have an internship at the Domain or the tech corridor.',
    available_from: '2026-05-20', available_to: '2026-08-20',
    furnished: false, sublease_type: 'private_room',
    amenities: ['WiFi', 'Pet-friendly', 'AC'],
    photos: [],
    lister_id: 'demo-user-5', lister_name: 'Priya Menon',
    lister_email: 'pmenon@utexas.edu', lister_university: 'UT Austin', lister_grad_year: 2027,
    trust_score: 83, created_at: '2026-02-22T08:30:00Z', status: 'active'
  },
  {
    id: 'demo-6',
    title: 'Luxury 2BR Downtown High-Rise',
    address: '360 Nueces St, Floor 18',
    city: 'Austin', state: 'TX',
    price: 1950, bedrooms: 2, bathrooms: 2, sqft: 1100,
    description: "Stunning two-bedroom in Austin's most prestigious downtown tower. 18th floor with panoramic views of the Capitol and Lady Bird Lake. Concierge building, rooftop pool, private dog park. Walking distance to 6th Street, Rainey St, and the Convention Center. Furnished with premium pieces.",
    available_from: '2026-06-01', available_to: '2026-08-31',
    furnished: true, sublease_type: 'whole_unit',
    amenities: ['WiFi', 'Parking', 'Pool', 'Gym', 'Rooftop', 'Furnished', 'In-unit W/D', 'AC'],
    photos: [],
    lister_id: 'demo-user-6', lister_name: 'Aiden Walsh',
    lister_email: 'awalsh@mccombs.utexas.edu', lister_university: 'UT McCombs', lister_grad_year: 2026,
    trust_score: 97, created_at: '2026-02-25T13:00:00Z', status: 'active'
  },
  {
    id: 'demo-7',
    title: 'Student-Friendly Studio, Medical District',
    address: '5808 Medical Pkwy, #302',
    city: 'Austin', state: 'TX',
    price: 780, bedrooms: 0, bathrooms: 1, sqft: 390,
    description: "Perfect for medical or nursing students. This efficient studio is connected by shuttle to Dell Medical School and St. David's. Very quiet building, all professionals. Updated bath, walk-in closet, controlled-access parking. Utilities (water/electric) included in rent.",
    available_from: '2026-05-01', available_to: '2026-07-31',
    furnished: false, sublease_type: 'whole_unit',
    amenities: ['Parking', 'AC', 'Utilities Included'],
    photos: [],
    lister_id: 'demo-user-7', lister_name: 'Zara Ahmed',
    lister_email: 'zahmed@utexas.edu', lister_university: 'UT Austin', lister_grad_year: 2028,
    trust_score: 86, created_at: '2026-03-01T10:00:00Z', status: 'active'
  },
  {
    id: 'demo-8',
    title: 'Charming 3BR — Perfect for Friend Group',
    address: '2209 Speedway, House',
    city: 'Austin', state: 'TX',
    price: 1700, bedrooms: 3, bathrooms: 2, sqft: 1250,
    description: 'Iconic Speedway house — classic Austin bungalow 2 blocks from campus. Ideal for a friend group subletting together for the summer. Huge covered porch, backyard with grill, original hardwood throughout. All three rooms available — lease the whole house. Landlord is awesome and flexible.',
    available_from: '2026-05-10', available_to: '2026-08-10',
    furnished: false, sublease_type: 'whole_unit',
    amenities: ['WiFi', 'Pet-friendly', 'AC', 'Parking'],
    photos: [],
    lister_id: 'demo-user-8', lister_name: 'Caleb Johnson',
    lister_email: 'cjohnson@utexas.edu', lister_university: 'UT Austin', lister_grad_year: 2026,
    trust_score: 90, created_at: '2026-03-05T15:20:00Z', status: 'active'
  }
];

const DEMO_USERS = {
  'demo-user-1': { id:'demo-user-1', name:'Maya Patel',    email:'mpatel@utexas.edu',         university:'UT Austin',  grad_year:2026, bio:'CS grad student, coffee enthusiast.',       trust_score:92 },
  'demo-user-2': { id:'demo-user-2', name:'James Okonkwo', email:'jokonkwo@utexas.edu',        university:'UT Austin',  grad_year:2027, bio:'Architecture MArch student.',               trust_score:88 },
  'demo-user-3': { id:'demo-user-3', name:'Sofia Reyes',   email:'sreyes@utexas.edu',          university:'UT Austin',  grad_year:2026, bio:'Biology PhD candidate, plant mom.',         trust_score:95 },
  'demo-user-4': { id:'demo-user-4', name:'Derek Huang',   email:'dhuang@utexas.edu',          university:'UT Austin',  grad_year:2025, bio:'Finance MBA.',                              trust_score:79 },
  'demo-user-5': { id:'demo-user-5', name:'Priya Menon',   email:'pmenon@utexas.edu',          university:'UT Austin',  grad_year:2027, bio:'UX design intern this summer.',             trust_score:83 },
  'demo-user-6': { id:'demo-user-6', name:'Aiden Walsh',   email:'awalsh@mccombs.utexas.edu',  university:'UT McCombs', grad_year:2026, bio:'MBA student, weekend cyclist.',             trust_score:97 },
  'demo-user-7': { id:'demo-user-7', name:'Zara Ahmed',    email:'zahmed@utexas.edu',          university:'UT Austin',  grad_year:2028, bio:'Medical student, early bird.',              trust_score:86 },
  'demo-user-8': { id:'demo-user-8', name:'Caleb Johnson', email:'cjohnson@utexas.edu',        university:'UT Austin',  grad_year:2026, bio:'Kinesiology senior, huge Longhorns fan.',  trust_score:90 }
};

// ── Auth ──────────────────────────────────────────────────────
const Auth = {
  async getUser() {
    const sb = getSupabase();
    if (!sb) return JSON.parse(localStorage.getItem('ss_demo_user') || 'null');
    try {
      const { data: { user } } = await sb.auth.getUser();
      if (user) {
        const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
        return { ...user, ...(profile || {}) };
      }
      return null;
    } catch (e) { return null; }
  },

  async signUp({ email, password, name, university, grad_year }) {
    const sb = getSupabase();
    if (!sb) {
      const u = {
        id: 'local-' + Date.now(), email, name, university,
        grad_year: grad_year || null,
        is_edu: email.toLowerCase().endsWith('.edu'),
        trust_score: email.toLowerCase().endsWith('.edu') ? 75 : 65,
        created_at: new Date().toISOString()
      };
      localStorage.setItem('ss_demo_user', JSON.stringify(u));
      return { user: u, error: null };
    }
    try {
      const { data, error } = await sb.auth.signUp({
        email, password,
        options: { data: { name, university, grad_year } }
      });
      if (error) return { user: null, error: error.message };
      // Profile is auto-created by the trigger — just upsert extras if needed
      if (data.user) {
        await sb.from('profiles').upsert({
          id: data.user.id, name, university,
          grad_year: grad_year || null, email
          // NOTE: is_edu is a generated column — do NOT include it here
        }, { onConflict: 'id' });
      }
      return { user: data.user, error: null };
    } catch (e) { return { user: null, error: e.message }; }
  },

  async signIn({ email, password }) {
    const sb = getSupabase();
    if (!sb) {
      // Demo mode: accept any credentials
      const existing = JSON.parse(localStorage.getItem('ss_demo_user') || 'null');
      const u = existing || {
        id: 'local-' + Date.now(), email,
        name: email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g, c => c.toUpperCase()),
        is_edu: email.toLowerCase().endsWith('.edu'),
        trust_score: email.toLowerCase().endsWith('.edu') ? 75 : 65,
        created_at: new Date().toISOString()
      };
      localStorage.setItem('ss_demo_user', JSON.stringify(u));
      return { user: u, error: null };
    }
    try {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) return { user: null, error: error.message };
      return { user: data.user, error: null };
    } catch (e) { return { user: null, error: e.message }; }
  },

  async signOut() {
    localStorage.removeItem('ss_demo_user');
    const sb = getSupabase();
    if (sb) { try { await sb.auth.signOut(); } catch (e) {} }
  },

  onAuthChange(cb) {
    const sb = getSupabase();
    if (sb) sb.auth.onAuthStateChange((event, session) => cb(event, session));
  }
};

// ── Listings ──────────────────────────────────────────────────
const Listings = {
  async getAll(filters = {}) {
    const sb = getSupabase();
    if (!sb) {
      // Merge demo listings with any locally-created ones
      const local = JSON.parse(localStorage.getItem('ss_my_listings') || '[]');
      let results = [...local, ...DEMO_LISTINGS];
      // Remove duplicates by id
      const seen = new Set();
      results = results.filter(l => { if (seen.has(l.id)) return false; seen.add(l.id); return true; });

      if (filters.city) {
        const q = filters.city.toLowerCase();
        results = results.filter(l =>
          l.city.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q) ||
          l.title.toLowerCase().includes(q)
        );
      }
      if (filters.min_price !== undefined) results = results.filter(l => l.price >= Number(filters.min_price));
      if (filters.max_price !== undefined) results = results.filter(l => l.price <= Number(filters.max_price));
      if (filters.bedrooms && filters.bedrooms !== 'any') {
        if (filters.bedrooms === '3+') results = results.filter(l => l.bedrooms >= 3);
        else results = results.filter(l => l.bedrooms === Number(filters.bedrooms));
      }
      if (filters.available_from) results = results.filter(l => l.available_to >= filters.available_from);
      if (filters.available_to)   results = results.filter(l => l.available_from <= filters.available_to);

      if (filters.sort === 'price_asc')  results.sort((a,b) => a.price - b.price);
      else if (filters.sort === 'price_desc') results.sort((a,b) => b.price - a.price);
      else results.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

      return { listings: results, error: null };
    }
    try {
      let q = sb.from('listings').select(`
        *, profiles!listings_lister_id_fkey(
          name, email, avatar_url, university, grad_year, is_edu, trust_score
        )
      `).eq('status', 'active');
      if (filters.city) q = q.ilike('city', `%${filters.city}%`);
      if (filters.min_price !== undefined) q = q.gte('price', filters.min_price);
      if (filters.max_price !== undefined) q = q.lte('price', filters.max_price);
      if (filters.bedrooms && filters.bedrooms !== 'any') {
        if (filters.bedrooms === '3+') q = q.gte('bedrooms', 3);
        else q = q.eq('bedrooms', Number(filters.bedrooms));
      }
      if (filters.sort === 'price_asc')  q = q.order('price', { ascending: true });
      else if (filters.sort === 'price_desc') q = q.order('price', { ascending: false });
      else q = q.order('created_at', { ascending: false });
      const { data, error } = await q;
      if (error) throw error;
      // Normalize profile join fields
      return { listings: (data || []).map(normalizeListing), error: null };
    } catch (e) {
      console.warn('Listings.getAll fell back to demo:', e.message);
      return { listings: DEMO_LISTINGS, error: null };
    }
  },

  async getById(id) {
    const sb = getSupabase();
    if (!sb) {
      // Check local first
      const local = JSON.parse(localStorage.getItem('ss_my_listings') || '[]');
      const listing = local.find(l => l.id === id)
        || DEMO_LISTINGS.find(l => l.id === id)
        || DEMO_LISTINGS[0];
      return { listing, error: null };
    }
    try {
      const { data, error } = await sb.from('listings').select(`
        *, profiles!listings_lister_id_fkey(
          name, email, avatar_url, university, grad_year, is_edu, trust_score
        )
      `).eq('id', id).single();
      if (error) throw error;
      return { listing: normalizeListing(data), error: null };
    } catch (e) {
      const local = JSON.parse(localStorage.getItem('ss_my_listings') || '[]');
      const listing = local.find(l => l.id === id)
        || DEMO_LISTINGS.find(l => l.id === id)
        || DEMO_LISTINGS[0];
      return { listing, error: null };
    }
  },

  async create(listing) {
    const sb = getSupabase();
    const user = await Auth.getUser();
    if (!user) return { listing: null, error: 'Not signed in' };
    if (!sb) {
      const newL = {
        ...listing,
        id: 'local-' + Date.now(),
        lister_id: user.id,
        lister_name: user.name || user.email.split('@')[0],
        lister_email: user.email,
        lister_university: user.university || '',
        lister_grad_year: user.grad_year || null,
        trust_score: user.trust_score || 70,
        created_at: new Date().toISOString(),
        status: 'active'
      };
      const saved = JSON.parse(localStorage.getItem('ss_my_listings') || '[]');
      saved.unshift(newL);
      localStorage.setItem('ss_my_listings', JSON.stringify(saved));
      return { listing: newL, error: null };
    }
    try {
      const { data, error } = await sb.from('listings')
        .insert({ ...listing, lister_id: user.id, status: 'active' })
        .select().single();
      if (error) throw error;
      return { listing: data, error: null };
    } catch (e) { return { listing: null, error: e.message }; }
  },

  async uploadImage(file) {
    const sb = getSupabase();
    if (!sb) return { url: null, error: 'Demo mode — images not uploaded' };
    try {
      const ext = file.name.split('.').pop().toLowerCase();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await sb.storage.from('listing-images').upload(path, file, { contentType: file.type });
      if (upErr) throw upErr;
      const { data } = sb.storage.from('listing-images').getPublicUrl(path);
      return { url: data.publicUrl, error: null };
    } catch (e) { return { url: null, error: e.message }; }
  },

  async getMyListings() {
    const sb = getSupabase();
    const user = await Auth.getUser();
    if (!user) return { listings: [], error: 'Not signed in' };
    if (!sb) {
      const local = JSON.parse(localStorage.getItem('ss_my_listings') || '[]');
      return { listings: local, error: null };
    }
    try {
      const { data, error } = await sb.from('listings').select('*')
        .eq('lister_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      return { listings: data || [], error: null };
    } catch (e) { return { listings: [], error: e.message }; }
  },

  async update(id, updates) {
    const sb = getSupabase();
    if (!sb) {
      const saved = JSON.parse(localStorage.getItem('ss_my_listings') || '[]');
      const idx = saved.findIndex(l => l.id === id);
      if (idx !== -1) {
        saved[idx] = { ...saved[idx], ...updates };
        localStorage.setItem('ss_my_listings', JSON.stringify(saved));
      }
      return { error: null };
    }
    try {
      const { error } = await sb.from('listings').update(updates).eq('id', id);
      return { error: error ? error.message : null };
    } catch (e) { return { error: e.message }; }
  },

  async delete(id) {
    const sb = getSupabase();
    if (!sb) {
      const saved = JSON.parse(localStorage.getItem('ss_my_listings') || '[]');
      localStorage.setItem('ss_my_listings', JSON.stringify(saved.filter(l => l.id !== id)));
      return { error: null };
    }
    try {
      const { error } = await sb.from('listings').delete().eq('id', id);
      return { error: error ? error.message : null };
    } catch (e) { return { error: e.message }; }
  }
};

// Normalize a listing row that has a joined profiles object
function normalizeListing(l) {
  if (!l) return l;
  const p = l.profiles || {};
  return {
    ...l,
    lister_name:       l.lister_name       || p.name        || 'Anonymous',
    lister_email:      l.lister_email       || p.email       || '',
    lister_university: l.lister_university  || p.university  || '',
    lister_grad_year:  l.lister_grad_year   || p.grad_year   || null,
    lister_avatar:     l.lister_avatar      || p.avatar_url  || null,
    trust_score:       l.trust_score        || p.trust_score || 70,
    is_edu:            l.is_edu             ?? p.is_edu      ?? false,
  };
}

// ── Messages ──────────────────────────────────────────────────
const Messages = {
  async getConversations() {
    const sb = getSupabase();
    const user = await Auth.getUser();
    if (!user) return { conversations: [], error: null };
    if (!sb) {
      const msgs = JSON.parse(localStorage.getItem('ss_messages') || '[]');
      // Latest message per (listing, other_user) pair
      const map = {};
      msgs.forEach(m => {
        const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
        const key = m.listing_id + '_' + otherId;
        if (!map[key] || new Date(m.created_at) > new Date(map[key].created_at)) map[key] = m;
      });
      return { conversations: Object.values(map), error: null };
    }
    try {
      const { data, error } = await sb.from('messages')
        .select('*, listings(title, id), profiles!messages_sender_id_fkey(name, avatar_url)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { conversations: data || [], error: null };
    } catch (e) { return { conversations: [], error: e.message }; }
  },

  async getThread(listingId, otherUserId) {
    const sb = getSupabase();
    const user = await Auth.getUser();
    if (!user) return { messages: [], error: null };
    if (!sb) {
      const msgs = JSON.parse(localStorage.getItem('ss_messages') || '[]');
      const thread = msgs.filter(m =>
        m.listing_id === listingId &&
        ((m.sender_id === user.id && m.receiver_id === otherUserId) ||
         (m.sender_id === otherUserId && m.receiver_id === user.id))
      ).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      return { messages: thread, error: null };
    }
    try {
      const { data, error } = await sb.from('messages').select('*')
        .eq('listing_id', listingId)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      if (error) throw error;
      // Mark received messages as read
      const unread = (data || []).filter(m => m.receiver_id === user.id && !m.read).map(m => m.id);
      if (unread.length) sb.from('messages').update({ read: true }).in('id', unread).then(() => {});
      return { messages: data || [], error: null };
    } catch (e) { return { messages: [], error: e.message }; }
  },

  async send(listingId, receiverId, content) {
    const sb = getSupabase();
    const user = await Auth.getUser();
    if (!user) return { error: 'Not signed in' };
    const msg = {
      id: 'msg-' + Date.now(),
      listing_id: listingId,
      sender_id: user.id,
      receiver_id: receiverId,
      content,
      created_at: new Date().toISOString(),
      read: false
    };
    if (!sb) {
      const msgs = JSON.parse(localStorage.getItem('ss_messages') || '[]');
      msgs.push(msg);
      localStorage.setItem('ss_messages', JSON.stringify(msgs));
      return { message: msg, error: null };
    }
    try {
      const { data, error } = await sb.from('messages')
        .insert({ listing_id: listingId, sender_id: user.id, receiver_id: receiverId, content })
        .select().single();
      if (error) throw error;
      return { message: data, error: null };
    } catch (e) { return { error: e.message }; }
  },

  subscribeToThread(listingId, userId1, userId2, callback) {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      return sb.channel(`thread-${listingId}-${userId1}`)
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'messages',
          filter: `listing_id=eq.${listingId}`
        }, payload => callback(payload.new))
        .subscribe();
    } catch (e) { return null; }
  }
};

// ── Saved ─────────────────────────────────────────────────────
const Saved = {
  async toggle(listingId) {
    const sb = getSupabase();
    const user = await Auth.getUser();
    if (!user) return { saved: false, error: 'Not signed in' };
    if (!sb) {
      const saved = JSON.parse(localStorage.getItem('ss_saved') || '[]');
      const idx = saved.indexOf(listingId);
      if (idx === -1) {
        saved.push(listingId);
        localStorage.setItem('ss_saved', JSON.stringify(saved));
        return { saved: true, error: null };
      } else {
        saved.splice(idx, 1);
        localStorage.setItem('ss_saved', JSON.stringify(saved));
        return { saved: false, error: null };
      }
    }
    try {
      const { data } = await sb.from('saved_listings').select('id')
        .eq('user_id', user.id).eq('listing_id', listingId).maybeSingle();
      if (data) {
        await sb.from('saved_listings').delete().eq('user_id', user.id).eq('listing_id', listingId);
        return { saved: false, error: null };
      } else {
        await sb.from('saved_listings').insert({ user_id: user.id, listing_id: listingId });
        return { saved: true, error: null };
      }
    } catch (e) { return { saved: false, error: e.message }; }
  },

  async getAll() {
    const sb = getSupabase();
    const user = await Auth.getUser();
    if (!user) return { listings: [], error: null };
    if (!sb) {
      const ids = JSON.parse(localStorage.getItem('ss_saved') || '[]');
      const local = JSON.parse(localStorage.getItem('ss_my_listings') || '[]');
      const allL = [...local, ...DEMO_LISTINGS];
      return { listings: allL.filter(l => ids.includes(l.id)), error: null };
    }
    try {
      const { data, error } = await sb.from('saved_listings')
        .select('listing_id, listings(*)').eq('user_id', user.id);
      if (error) throw error;
      return { listings: (data || []).map(r => r.listings).filter(Boolean).map(normalizeListing), error: null };
    } catch (e) { return { listings: [], error: e.message }; }
  },

  isSaved(listingId) {
    const saved = JSON.parse(localStorage.getItem('ss_saved') || '[]');
    return saved.includes(listingId);
  }
};

// ── Profile ───────────────────────────────────────────────────
const Profile = {
  async get(userId) {
    const sb = getSupabase();
    if (!sb) return { profile: DEMO_USERS[userId] || null, error: null };
    try {
      const { data, error } = await sb.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      return { profile: data, error: null };
    } catch (e) { return { profile: DEMO_USERS[userId] || null, error: null }; }
  },

  async update(updates) {
    const sb = getSupabase();
    const user = await Auth.getUser();
    if (!user) return { error: 'Not signed in' };
    if (!sb) {
      const u = JSON.parse(localStorage.getItem('ss_demo_user') || '{}');
      localStorage.setItem('ss_demo_user', JSON.stringify({ ...u, ...updates }));
      return { error: null };
    }
    try {
      // Never try to update generated columns
      const safe = { ...updates };
      delete safe.is_edu;
      delete safe.id;
      const { error } = await sb.from('profiles').update(safe).eq('id', user.id);
      return { error: error ? error.message : null };
    } catch (e) { return { error: e.message }; }
  },

  async uploadAvatar(file) {
    const sb = getSupabase();
    const user = await Auth.getUser();
    if (!user) return { url: null, error: 'Not signed in' };
    if (!sb) {
      const url = URL.createObjectURL(file);
      return { url, error: null };
    }
    try {
      const ext = file.name.split('.').pop().toLowerCase();
      const path = `avatars/${user.id}.${ext}`;
      const { error: upErr } = await sb.storage.from('listing-images').upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = sb.storage.from('listing-images').getPublicUrl(path);
      await sb.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id);
      return { url: data.publicUrl, error: null };
    } catch (e) { return { url: null, error: e.message }; }
  }
};

// ── Utilities ─────────────────────────────────────────────────
function formatPrice(n) {
  return '$' + Number(n).toLocaleString('en-US');
}

function formatDate(str) {
  if (!str) return '—';
  // Add time to avoid timezone-shifting the date
  const d = new Date(str.includes('T') ? str : str + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(str) {
  if (!str) return '—';
  const d = new Date(str.includes('T') ? str : str + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function timeAgo(str) {
  if (!str) return '';
  const diff = Date.now() - new Date(str).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60)  return 'just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)   return `${days}d ago`;
  if (days < 30)  return `${Math.floor(days/7)}w ago`;
  return formatDateShort(str);
}

function bedsLabel(n) {
  const num = Number(n);
  if (num === 0) return 'Studio';
  if (num === 1) return '1 Bed';
  return `${num} Beds`;
}

function bedsEmoji(n) {
  const num = Number(n);
  if (num === 0) return '🏠';
  if (num === 1) return '🛏️';
  if (num === 2) return '🏡';
  if (num === 3) return '🏘️';
  return '🏢';
}

function trustColor(score) {
  const s = Number(score) || 70;
  if (s >= 90) return '#5a8a4f';
  if (s >= 75) return '#BF5700';
  return '#8a7d6b';
}

function isEdu(email) {
  return (email || '').toLowerCase().endsWith('.edu');
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function monthsDiff(from, to) {
  if (!from || !to) return 0;
  const a = new Date(from + 'T12:00:00');
  const b = new Date(to   + 'T12:00:00');
  const diff = (b - a) / (1000 * 60 * 60 * 24 * 30.44);
  return Math.max(1, Math.round(diff));
}

// ── renderNav ─────────────────────────────────────────────────
async function renderNav(activePage) {
  const navEl = document.getElementById('nav');
  if (!navEl) return;
  const user = await Auth.getUser();

  navEl.innerHTML = `
<nav class="nav-inner">
  <a href="subletsync.html" class="nav-logo" aria-label="SubletSync home">
    <span class="logo-sq">SS</span>
    <span class="logo-text">SubletSync</span>
  </a>
  <div class="nav-links">
    <a href="browse.html"   class="nav-link${activePage === 'browse'   ? ' active' : ''}">Browse</a>
    <a href="post.html"     class="nav-link${activePage === 'post'     ? ' active' : ''}">Post a listing</a>
  </div>
  <div class="nav-right">
    ${user ? `
      <a href="messages.html"  class="nav-link${activePage === 'messages' ? ' active' : ''}">Messages</a>
      <a href="dashboard.html" class="nav-avatar" title="${escapeHtml(user.name || user.email)}" aria-label="Dashboard">
        ${user.avatar_url
          ? `<img src="${user.avatar_url}" alt="${escapeHtml(user.name || '')}" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>`
          : escapeHtml(initials(user.name || user.email))
        }
      </a>
    ` : `
      <a href="auth.html"              class="btn-ghost btn-sm">Sign in</a>
      <a href="auth.html?mode=signup"  class="btn-fill  btn-sm">Get started</a>
    `}
  </div>
  <button class="nav-burger" aria-label="Menu" onclick="toggleMobileNav(this)">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="nav-mobile" id="nav-mobile">
  <a href="browse.html" class="nav-link">Browse</a>
  <a href="post.html"   class="nav-link">Post a listing</a>
  ${user
    ? `<a href="messages.html"  class="nav-link">Messages</a>
       <a href="dashboard.html" class="nav-link">Dashboard</a>
       <a href="#" class="nav-link" onclick="event.preventDefault();Auth.signOut().then(()=>location.href='subletsync.html')">Sign out</a>`
    : `<a href="auth.html"             class="nav-link">Sign in</a>
       <a href="auth.html?mode=signup" class="btn-fill nav-mobile-cta">Get started</a>`
  }
</div>`;
}

function toggleMobileNav(btn) {
  const m = document.getElementById('nav-mobile');
  if (!m) return;
  const open = m.classList.toggle('open');
  // Animate burger → X
  if (btn) {
    const spans = btn.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  }
}

// ── Shared Nav CSS (injected once per page) ───────────────────
const NAV_CSS = `
  #nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.94);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
  }
  .nav-inner {
    max-width: var(--max); margin: 0 auto;
    padding: 0 24px; height: 68px;
    display: flex; align-items: center; gap: 28px;
  }
  .nav-logo  { display:flex; align-items:center; gap:10px; text-decoration:none; flex-shrink:0; }
  .logo-sq   { width:34px;height:34px;background:var(--accent);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--font-d);font-size:16px;font-weight:700;letter-spacing:-0.5px;flex-shrink:0; }
  .logo-text { font-family:var(--font-b);font-size:17px;font-weight:700;color:var(--text);letter-spacing:-0.3px; }
  .nav-links { display:flex;gap:2px;flex:1; }
  .nav-link  { font-family:var(--font-b);font-size:14px;font-weight:500;color:var(--muted);text-decoration:none;padding:6px 12px;border-radius:8px;transition:color 0.2s,background 0.2s;white-space:nowrap; }
  .nav-link:hover,.nav-link.active { color:var(--accent);background:var(--accent-light); }
  .nav-right { display:flex;align-items:center;gap:10px;margin-left:auto;flex-shrink:0; }
  .nav-avatar { width:38px;height:38px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--font-b);font-size:13px;font-weight:700;text-decoration:none;flex-shrink:0;overflow:hidden;transition:opacity 0.2s; }
  .nav-avatar:hover { opacity:0.85; }
  .btn-fill  { background:var(--accent);color:#fff;border:none;border-radius:var(--r);font-family:var(--font-b);font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:background 0.2s,transform 0.15s; }
  .btn-fill:hover { background:var(--accent-dark);transform:translateY(-1px); }
  .btn-ghost { background:transparent;color:var(--accent);border:1.5px solid var(--accent);border-radius:var(--r);font-family:var(--font-b);font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:background 0.2s; }
  .btn-ghost:hover { background:var(--accent-light); }
  .btn-sm  { padding:7px 16px; }
  .btn-lg  { padding:13px 28px;font-size:15px; }
  .nav-burger { display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px;flex-shrink:0; }
  .nav-burger span { display:block;width:22px;height:2px;background:var(--text);border-radius:2px;transition:transform 0.25s,opacity 0.25s; }
  .nav-mobile { display:none;flex-direction:column;padding:10px 20px 16px;background:#fff;border-bottom:1px solid var(--border);gap:2px; }
  .nav-mobile.open { display:flex;animation:slideDown 0.2s ease; }
  .nav-mobile .nav-link { padding:10px 12px;border-radius:8px; }
  .nav-mobile-cta { margin-top:8px;padding:11px 16px;text-align:center;border-radius:var(--r); }
  @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }
  @media(max-width:640px){
    .nav-links { display:none }
    .nav-right .btn-fill,.nav-right .btn-ghost { display:none }
    .nav-burger { display:flex }
  }
`;

(function injectNavCss() {
  if (document.getElementById('ss-nav-css')) return;
  const s = document.createElement('style');
  s.id = 'ss-nav-css';
  s.textContent = NAV_CSS;
  document.head.appendChild(s);
})();
