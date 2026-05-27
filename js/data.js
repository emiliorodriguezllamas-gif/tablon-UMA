// ============================================
// TABLÓN UMA - Base de Datos Local
// Sistema de datos con localStorage
// ============================================

const DB = {
  KEYS: {
    USERS: 'tablon_users',
    POSTS: 'tablon_posts',
    RIDES: 'tablon_rides',
    EVENTS: 'tablon_events',
    MESSAGES: 'tablon_messages',
    SESSION: 'tablon_session',
    NOTIFICATIONS: 'tablon_notifications'
  },

  // ---- Usuarios pre-cargados ----
  defaultUsers: [
    {
      id: 'user_001',
      username: 'maria.garcia',
      password: 'tuenti2026',
      name: 'María García',
      town: 'Alhaurín de la Torre',
      university: 'Universidad de Málaga',
      campus: 'Teatinos',
      degree: 'Ingeniería Informática',
      year: 3,
      bio: '💻 Futura ingeniera informática | Amante del café y el código | Alhaurín de la Torre → Teatinos cada día 🚗',
      avatar: null,
      avatarColor: '#3B82F6',
      friends: ['user_002', 'user_003', 'user_004', 'user_005', 'user_008'],
      friendRequests: [],
      joinDate: '2025-09-15',
      online: true
    },
    {
      id: 'user_002',
      username: 'carlos.ruiz',
      password: 'tuenti2026',
      name: 'Carlos Ruiz',
      town: 'Rincón de la Victoria',
      university: 'Universidad de Málaga',
      campus: 'Teatinos',
      degree: 'Administración y Dirección de Empresas',
      year: 2,
      bio: '📊 Estudiante de ADE | DJ los fines de semana 🎧 | Rincón → Teatinos',
      avatar: null,
      avatarColor: '#EF4444',
      friends: ['user_001', 'user_003', 'user_006', 'user_009'],
      friendRequests: ['user_010'],
      joinDate: '2025-09-20',
      online: false
    },
    {
      id: 'user_003',
      username: 'laura.fernandez',
      password: 'tuenti2026',
      name: 'Laura Fernández',
      town: 'Torremolinos',
      university: 'Universidad de Málaga',
      campus: 'El Ejido',
      degree: 'Derecho',
      year: 4,
      bio: '⚖️ Futura abogada | Feminista | Torremolinos beach lover 🏖️',
      avatar: null,
      avatarColor: '#A855F7',
      friends: ['user_001', 'user_002', 'user_005', 'user_007'],
      friendRequests: [],
      joinDate: '2024-09-10',
      online: true
    },
    {
      id: 'user_004',
      username: 'pablo.martin',
      password: 'tuenti2026',
      name: 'Pablo Martín',
      town: 'Benalmádena',
      university: 'Universidad de Málaga',
      campus: 'Teatinos',
      degree: 'Medicina',
      year: 5,
      bio: '🩺 MIR en camino | Runner 🏃 | Siempre dispuesto a compartir coche desde Benalmádena',
      avatar: null,
      avatarColor: '#10B981',
      friends: ['user_001', 'user_006', 'user_008', 'user_010'],
      friendRequests: [],
      joinDate: '2023-09-05',
      online: false
    },
    {
      id: 'user_005',
      username: 'ana.lopez',
      password: 'tuenti2026',
      name: 'Ana López',
      town: 'Fuengirola',
      university: 'Universidad de Málaga',
      campus: 'Teatinos',
      degree: 'Psicología',
      year: 2,
      bio: '🧠 Explorando la mente humana | Yoga & meditación 🧘 | Fuengirola → Teatinos buscando coche!',
      avatar: null,
      avatarColor: '#F59E0B',
      friends: ['user_001', 'user_003', 'user_007', 'user_009'],
      friendRequests: ['user_006'],
      joinDate: '2025-09-18',
      online: true
    },
    {
      id: 'user_006',
      username: 'david.moreno',
      password: 'tuenti2026',
      name: 'David Moreno',
      town: 'Antequera',
      university: 'Universidad de Málaga',
      campus: 'Teatinos',
      degree: 'Ingeniería Industrial',
      year: 3,
      bio: '⚙️ Ingeniero industrial en formación | Gamer 🎮 | Antequera-Málaga: el viaje más largo pero merece la pena',
      avatar: null,
      avatarColor: '#06B6D4',
      friends: ['user_002', 'user_004', 'user_008', 'user_010'],
      friendRequests: [],
      joinDate: '2025-02-10',
      online: false
    },
    {
      id: 'user_007',
      username: 'sofia.navarro',
      password: 'tuenti2026',
      name: 'Sofía Navarro',
      town: 'Vélez-Málaga',
      university: 'Universidad de Málaga',
      campus: 'El Ejido',
      degree: 'Filología Hispánica',
      year: 1,
      bio: '📚 Amante de la literatura | Escritora en ciernes ✍️ | De la Axarquía a El Ejido',
      avatar: null,
      avatarColor: '#EC4899',
      friends: ['user_003', 'user_005', 'user_009'],
      friendRequests: ['user_001'],
      joinDate: '2026-01-15',
      online: true
    },
    {
      id: 'user_008',
      username: 'javier.torres',
      password: 'tuenti2026',
      name: 'Javier Torres',
      town: 'Coín',
      university: 'Universidad de Málaga',
      campus: 'Teatinos',
      degree: 'Ingeniería de Telecomunicaciones',
      year: 4,
      bio: '📡 Telecos rules! | Guitarrista en banda local 🎸 | Coin → Teatinos, ¿alguien se apunta?',
      avatar: null,
      avatarColor: '#8B5CF6',
      friends: ['user_001', 'user_004', 'user_006'],
      friendRequests: [],
      joinDate: '2024-09-12',
      online: false
    },
    {
      id: 'user_009',
      username: 'elena.romero',
      password: 'tuenti2026',
      name: 'Elena Romero',
      town: 'Marbella',
      university: 'Universidad de Málaga',
      campus: 'Teatinos',
      degree: 'Arquitectura',
      year: 3,
      bio: '🏛️ Diseñando el futuro | Fotógrafa amateur 📸 | Marbella → Málaga: el trayecto más bonito de la costa',
      avatar: null,
      avatarColor: '#F97316',
      friends: ['user_002', 'user_005', 'user_007', 'user_010'],
      friendRequests: [],
      joinDate: '2025-03-20',
      online: true
    },
    {
      id: 'user_010',
      username: 'miguel.diaz',
      password: 'tuenti2026',
      name: 'Miguel Ángel Díaz',
      town: 'Álora',
      university: 'Universidad de Málaga',
      campus: 'Teatinos',
      degree: 'Biología',
      year: 2,
      bio: '🌿 Biólogo en prácticas | Senderismo los domingos ⛰️ | Valle del Guadalhorce represent!',
      avatar: null,
      avatarColor: '#22C55E',
      friends: ['user_004', 'user_006', 'user_009'],
      friendRequests: [],
      joinDate: '2025-09-22',
      online: false
    }
  ],

  // ---- Posts pre-cargados ----
  defaultPosts: [
    {
      id: 'post_001',
      userId: 'user_001',
      content: '¡Por fin terminé el proyecto de Bases de Datos! 🎉 3 semanas sin dormir pero ha merecido la pena. ¿Alguien más lo ha entregado ya?',
      timestamp: '2026-05-26T10:30:00',
      likes: ['user_002', 'user_003', 'user_005', 'user_008'],
      comments: [
        { userId: 'user_008', content: '¡Enhorabuena María! Yo lo entrego mañana, estoy muerto 😵', timestamp: '2026-05-26T10:45:00' },
        { userId: 'user_002', content: 'Yo ni he empezado... RIP 💀', timestamp: '2026-05-26T11:00:00' }
      ]
    },
    {
      id: 'post_002',
      userId: 'user_004',
      content: 'Mañana salgo de Benalmádena a las 7:30 dirección Teatinos. Tengo 3 plazas libres. ¿Alguien se apunta? 🚗 Paso por Torremolinos y Málaga centro.',
      timestamp: '2026-05-26T09:15:00',
      likes: ['user_001', 'user_003', 'user_006'],
      comments: [
        { userId: 'user_003', content: '¡Yo me apunto! ¿Me puedes recoger en la parada del bus de Torremolinos?', timestamp: '2026-05-26T09:20:00' },
        { userId: 'user_004', content: '@Laura claro! Te recojo allí a las 7:45 👍', timestamp: '2026-05-26T09:25:00' }
      ]
    },
    {
      id: 'post_003',
      userId: 'user_009',
      content: '📸 Fotos del atardecer desde la facultad de Arquitectura. Málaga no defrauda nunca. #UMA #Atardecer #Arquitectura',
      timestamp: '2026-05-25T20:00:00',
      likes: ['user_001', 'user_002', 'user_005', 'user_007', 'user_010'],
      comments: [
        { userId: 'user_007', content: '¡Qué pasada Elena! Desde El Ejido también se ven unos atardeceres increíbles', timestamp: '2026-05-25T20:15:00' }
      ]
    },
    {
      id: 'post_004',
      userId: 'user_006',
      content: '60 km de Antequera a Teatinos cada día. ¿Alguien de por la zona del interior para compartir gasolina? El depósito no se llena solo 😅⛽',
      timestamp: '2026-05-25T18:30:00',
      likes: ['user_004', 'user_008', 'user_010'],
      comments: [
        { userId: 'user_010', content: 'David! Yo soy de Álora, podemos cuadrar. Te mando mensaje privado.', timestamp: '2026-05-25T18:45:00' },
        { userId: 'user_006', content: '¡Genial Miguel! Así nos sale más barato a los dos 💪', timestamp: '2026-05-25T19:00:00' }
      ]
    },
    {
      id: 'post_005',
      userId: 'user_005',
      content: '¿Alguien va al concierto de indie en La Térmica este viernes? Busco gente para ir, ¡no quiero ir sola! 🎶',
      timestamp: '2026-05-25T14:00:00',
      likes: ['user_001', 'user_003', 'user_007', 'user_009'],
      comments: [
        { userId: 'user_003', content: '¡Yo voy seguro! Podemos quedar antes para tomar algo 🍺', timestamp: '2026-05-25T14:10:00' },
        { userId: 'user_009', content: 'Me apunto también, ¿a qué hora empieza?', timestamp: '2026-05-25T14:20:00' },
        { userId: 'user_005', content: 'Empieza a las 21:00, quedamos a las 20:00 en la puerta? 🎵', timestamp: '2026-05-25T14:30:00' }
      ]
    },
    {
      id: 'post_006',
      userId: 'user_002',
      content: 'Sesión de DJ este sábado en Sala París 15. Entrada gratis si venís antes de las 00:00. ¡Os espero! 🎧🔥',
      timestamp: '2026-05-24T22:00:00',
      likes: ['user_001', 'user_004', 'user_005', 'user_006', 'user_009', 'user_010'],
      comments: [
        { userId: 'user_001', content: '¡Ahí estaremos Carlos! 🔥', timestamp: '2026-05-24T22:10:00' },
        { userId: 'user_006', content: 'Si alguien vuelve para Antequera luego, me apunto jaja', timestamp: '2026-05-24T22:15:00' }
      ]
    },
    {
      id: 'post_007',
      userId: 'user_007',
      content: 'Primera semana en la UMA superada ✅ Vélez-Málaga queda lejos pero la carrera de Filología es una pasada. ¡Encantada de conoceros a todos!',
      timestamp: '2026-05-24T16:00:00',
      likes: ['user_003', 'user_005', 'user_009'],
      comments: [
        { userId: 'user_003', content: 'Bienvenida Sofía! Si necesitas ayuda con algo, aquí estamos 😊', timestamp: '2026-05-24T16:15:00' }
      ]
    },
    {
      id: 'post_008',
      userId: 'user_008',
      content: 'Ensayo con la banda en Coín este finde. Si alguien quiere venir a escucharnos, ¡estáis invitados! 🎸🎶 Bar El Rinconcito a las 22h.',
      timestamp: '2026-05-24T12:00:00',
      likes: ['user_001', 'user_004'],
      comments: [
        { userId: 'user_001', content: 'Javi, ¿qué estilo tocáis?', timestamp: '2026-05-24T12:10:00' },
        { userId: 'user_008', content: 'Rock alternativo con toques de flamenco 🤘', timestamp: '2026-05-24T12:20:00' }
      ]
    },
    {
      id: 'post_009',
      userId: 'user_010',
      content: 'Ruta de senderismo por el Caminito del Rey este domingo. ¿Quién se anima? Salimos desde Álora a las 9:00. ¡Hay que reservar ya! 🥾⛰️',
      timestamp: '2026-05-23T19:00:00',
      likes: ['user_004', 'user_006', 'user_008', 'user_009'],
      comments: [
        { userId: 'user_006', content: '¡Yo me apunto Miguel! Paso a recogerte en Álora.', timestamp: '2026-05-23T19:10:00' },
        { userId: 'user_009', content: 'Siempre he querido ir, ¿queda alguna plaza?', timestamp: '2026-05-23T19:20:00' }
      ]
    },
    {
      id: 'post_010',
      userId: 'user_003',
      content: 'Examen de Derecho Constitucional aprobado con un 8.5 🎉⚖️ ¡Esto hay que celebrarlo! Chiringuito en Torremolinos esta tarde, ¿quién viene?',
      timestamp: '2026-05-23T13:00:00',
      likes: ['user_001', 'user_002', 'user_005', 'user_007'],
      comments: [
        { userId: 'user_005', content: '¡Enhorabuena Laura! Cuenta conmigo 🥂', timestamp: '2026-05-23T13:10:00' },
        { userId: 'user_001', content: 'Brutal! Nos vemos allí 🏖️', timestamp: '2026-05-23T13:15:00' }
      ]
    }
  ],

  // ---- Viajes/Rides pre-cargados ----
  defaultRides: [
    {
      id: 'ride_001',
      driverId: 'user_001',
      from: 'Alhaurín de la Torre',
      to: 'Campus Teatinos (UMA)',
      date: '2026-05-27',
      departureTime: '07:45',
      returnTime: '14:30',
      totalSeats: 4,
      availableSeats: 2,
      passengers: ['user_005'],
      price: 2.00,
      notes: 'Salgo desde la plaza del pueblo. Vuelvo después de clase de las 14:00. ¡Puntualidad please!',
      recurrent: true,
      recurrentDays: ['L', 'M', 'X', 'J', 'V'],
      status: 'active',
      createdAt: '2026-05-20T08:00:00'
    },
    {
      id: 'ride_002',
      driverId: 'user_004',
      from: 'Benalmádena',
      to: 'Campus Teatinos (UMA)',
      date: '2026-05-27',
      departureTime: '07:30',
      returnTime: '15:00',
      totalSeats: 3,
      availableSeats: 1,
      passengers: ['user_003', 'user_005'],
      price: 2.50,
      notes: 'Paso por Torremolinos a las 7:45. Arroyo de la Miel → Torremolinos → Teatinos.',
      recurrent: true,
      recurrentDays: ['L', 'M', 'X', 'J'],
      status: 'active',
      createdAt: '2026-05-18T10:00:00'
    },
    {
      id: 'ride_003',
      driverId: 'user_006',
      from: 'Antequera',
      to: 'Campus Teatinos (UMA)',
      date: '2026-05-27',
      departureTime: '07:00',
      returnTime: '16:00',
      totalSeats: 4,
      availableSeats: 2,
      passengers: ['user_010'],
      price: 4.00,
      notes: 'Salida desde Antequera centro. Paso por Álora y Valle del Guadalhorce. 60km de viaje, compartimos gasolina.',
      recurrent: true,
      recurrentDays: ['L', 'X', 'V'],
      status: 'active',
      createdAt: '2026-05-15T14:00:00'
    },
    {
      id: 'ride_004',
      driverId: 'user_009',
      from: 'Marbella',
      to: 'Campus Teatinos (UMA)',
      date: '2026-05-27',
      departureTime: '07:15',
      returnTime: '14:00',
      totalSeats: 3,
      availableSeats: 2,
      passengers: [],
      price: 3.50,
      notes: 'Salgo desde Marbella centro por la AP-7. Puedo recoger en Fuengirola y Benalmádena. El trayecto es largo pero con compañía se hace corto 😊',
      recurrent: true,
      recurrentDays: ['L', 'M', 'J'],
      status: 'active',
      createdAt: '2026-05-19T09:00:00'
    },
    {
      id: 'ride_005',
      driverId: 'user_008',
      from: 'Coín',
      to: 'Campus Teatinos (UMA)',
      date: '2026-05-27',
      departureTime: '07:30',
      returnTime: '15:30',
      totalSeats: 4,
      availableSeats: 3,
      passengers: [],
      price: 2.50,
      notes: 'Desde Coín por la carretera de Cártama. Si alguien es de Alhaurín el Grande o Cártama, le pilla de camino.',
      recurrent: true,
      recurrentDays: ['L', 'M', 'X', 'J', 'V'],
      status: 'active',
      createdAt: '2026-05-16T11:00:00'
    },
    {
      id: 'ride_006',
      driverId: 'user_002',
      from: 'Rincón de la Victoria',
      to: 'Campus Teatinos (UMA)',
      date: '2026-05-28',
      departureTime: '08:00',
      returnTime: '14:00',
      totalSeats: 3,
      availableSeats: 2,
      passengers: [],
      price: 2.00,
      notes: 'Salgo desde el Rincón, paso por el Palo y Málaga Este. ¡Buena música asegurada! 🎧',
      recurrent: true,
      recurrentDays: ['M', 'J'],
      status: 'active',
      createdAt: '2026-05-20T15:00:00'
    },
    {
      id: 'ride_007',
      driverId: 'user_007',
      from: 'Vélez-Málaga',
      to: 'Campus El Ejido (UMA)',
      date: '2026-05-27',
      departureTime: '08:00',
      returnTime: '14:30',
      totalSeats: 3,
      availableSeats: 2,
      passengers: [],
      price: 3.00,
      notes: 'Desde Vélez por la autovía del Mediterráneo. Puedo recoger en Torre del Mar y Rincón de la Victoria.',
      recurrent: true,
      recurrentDays: ['L', 'M', 'X', 'J', 'V'],
      status: 'active',
      createdAt: '2026-05-22T08:00:00'
    },
    {
      id: 'ride_008',
      driverId: 'user_001',
      from: 'Campus Teatinos (UMA)',
      to: 'Alhaurín de la Torre',
      date: '2026-05-27',
      departureTime: '14:30',
      returnTime: null,
      totalSeats: 4,
      availableSeats: 3,
      passengers: [],
      price: 2.00,
      notes: 'Vuelta a casa después de clases. Si alguien necesita que le deje en Campanillas o Cártama, me pilla de camino.',
      recurrent: true,
      recurrentDays: ['L', 'M', 'X', 'J', 'V'],
      status: 'active',
      createdAt: '2026-05-20T08:30:00'
    }
  ],

  // ---- Eventos / Noticias del tablón ----
  defaultEvents: [
    {
      id: 'evt_001',
      title: 'Festival de Música Indie - La Térmica',
      description: 'Tres días de música indie en La Térmica de Málaga. Bandas locales y nacionales. Entrada con carnet joven: 10€.',
      location: 'La Térmica, Málaga',
      date: '2026-05-30',
      time: '19:00',
      category: 'musica',
      price: '10€ (carnet joven)',
      organizer: 'Ayuntamiento de Málaga',
      attendees: ['user_001', 'user_003', 'user_005', 'user_009'],
      maxCapacity: 500,
      image: null
    },
    {
      id: 'evt_002',
      title: 'Feria de Empleo Universitario UMA 2026',
      description: 'Más de 50 empresas buscan talento joven. Trae tu CV y prepárate para entrevistas express. Talleres de LinkedIn y marca personal incluidos.',
      location: 'Aulario Gerald Brenan, Campus Teatinos',
      date: '2026-06-05',
      time: '09:00',
      category: 'empleo',
      price: 'Gratis',
      organizer: 'UMA - Servicio de Empleo',
      attendees: ['user_001', 'user_002', 'user_004', 'user_006', 'user_008'],
      maxCapacity: 1000,
      image: null
    },
    {
      id: 'evt_003',
      title: 'Torneo de Pádel Universitario',
      description: 'Torneo de pádel por parejas para estudiantes universitarios. Premios para los 3 primeros clasificados. ¡Inscríbete ya!',
      location: 'Polideportivo UMA, Teatinos',
      date: '2026-06-07',
      time: '10:00',
      category: 'deporte',
      price: '5€ por pareja',
      organizer: 'Deportes UMA',
      attendees: ['user_002', 'user_004', 'user_006'],
      maxCapacity: 64,
      image: null
    },
    {
      id: 'evt_004',
      title: 'Noche de Cine al Aire Libre',
      description: 'Ciclo de cine de verano en el campus. Esta semana: "Volver" de Almodóvar. Palomitas gratis para los primeros 100 asistentes.',
      location: 'Jardín Botánico UMA',
      date: '2026-06-02',
      time: '21:30',
      category: 'cultura',
      price: 'Gratis',
      organizer: 'Aula de Cine UMA',
      attendees: ['user_003', 'user_005', 'user_007', 'user_009', 'user_010'],
      maxCapacity: 200,
      image: null
    },
    {
      id: 'evt_005',
      title: 'Hackathon UMA 2026',
      description: '48 horas para desarrollar una app que mejore la vida universitaria. Premios de hasta 3000€. Equipos de 3-5 personas.',
      location: 'ETSII, Campus Teatinos',
      date: '2026-06-14',
      time: '09:00',
      category: 'tecnologia',
      price: 'Gratis',
      organizer: 'ETSII + Google Developer Group Málaga',
      attendees: ['user_001', 'user_006', 'user_008'],
      maxCapacity: 150,
      image: null
    },
    {
      id: 'evt_006',
      title: 'Ruta de Tapas Universitaria',
      description: 'Ruta por los mejores bares de tapas cerca del campus Teatinos. 8 bares, tapa + bebida por 2€ en cada uno con tu carnet de estudiante.',
      location: 'Zona Teatinos, Málaga',
      date: '2026-06-06',
      time: '20:00',
      category: 'gastronomia',
      price: '2€/tapa (con carnet)',
      organizer: 'Asociación de Comerciantes de Teatinos',
      attendees: ['user_001', 'user_002', 'user_003', 'user_004', 'user_005'],
      maxCapacity: 300,
      image: null
    },
    {
      id: 'evt_007',
      title: 'Voluntariado: Limpieza de Playa',
      description: 'Jornada de limpieza en la playa de La Malagueta. Materiales proporcionados. Certificado de voluntariado para tu CV.',
      location: 'Playa de La Malagueta, Málaga',
      date: '2026-06-01',
      time: '09:00',
      category: 'voluntariado',
      price: 'Gratis',
      organizer: 'ONG Mar Limpio + UMA Voluntariado',
      attendees: ['user_005', 'user_007', 'user_009', 'user_010'],
      maxCapacity: 100,
      image: null
    },
    {
      id: 'evt_008',
      title: 'Fiesta de Fin de Exámenes',
      description: 'La fiesta más esperada del cuatrimestre. 3 salas, 5 DJs (incluido nuestro Carlos Ruiz 🎧). Precio especial con carnet UMA.',
      location: 'Sala Gold, Málaga',
      date: '2026-06-20',
      time: '23:00',
      category: 'fiesta',
      price: '8€ con carnet UMA',
      organizer: 'Asociación de Estudiantes UMA',
      attendees: ['user_001', 'user_002', 'user_003', 'user_004', 'user_005', 'user_006', 'user_009'],
      maxCapacity: 800,
      image: null
    },
    {
      id: 'evt_009',
      title: 'Taller de Fotografía Urbana',
      description: 'Aprende técnicas de fotografía urbana con tu móvil. Recorrido por el centro histórico de Málaga. Nivel: todos los niveles.',
      location: 'Centro Histórico, Málaga',
      date: '2026-06-08',
      time: '17:00',
      category: 'cultura',
      price: 'Gratis',
      organizer: 'Aula de Fotografía UMA',
      attendees: ['user_003', 'user_007', 'user_009'],
      maxCapacity: 30,
      image: null
    },
    {
      id: 'evt_010',
      title: 'Mercadillo de Segunda Mano Universitario',
      description: 'Vende o compra libros, apuntes, ropa y todo lo que necesites. Stands gratis para estudiantes UMA.',
      location: 'Plaza Central, Campus Teatinos',
      date: '2026-06-03',
      time: '10:00',
      category: 'mercadillo',
      price: 'Gratis',
      organizer: 'Delegación de Estudiantes UMA',
      attendees: ['user_001', 'user_004', 'user_007', 'user_008', 'user_010'],
      maxCapacity: 200,
      image: null
    }
  ],

  // ---- Mensajes privados pre-cargados ----
  defaultMessages: [
    {
      id: 'msg_001',
      fromId: 'user_002',
      toId: 'user_001',
      content: '¡Ey María! ¿Tienes sitio mañana en el coche? Necesito llegar a Teatinos a las 8:30.',
      timestamp: '2026-05-26T17:00:00',
      read: false
    },
    {
      id: 'msg_002',
      fromId: 'user_001',
      toId: 'user_002',
      content: '¡Claro Carlos! Te recojo en la estación de tren de Alhaurín a las 7:50. ¿Te viene bien?',
      timestamp: '2026-05-26T17:05:00',
      read: true
    },
    {
      id: 'msg_003',
      fromId: 'user_005',
      toId: 'user_001',
      content: 'María, ¿puedo ir contigo mañana? Vengo desde Fuengirola pero puedo coger el cercanías hasta Alhaurín.',
      timestamp: '2026-05-26T16:00:00',
      read: false
    },
    {
      id: 'msg_004',
      fromId: 'user_006',
      toId: 'user_010',
      content: 'Miguel, mañana salgo de Antequera a las 7:00. ¿Te recojo en Álora sobre las 7:20?',
      timestamp: '2026-05-26T20:00:00',
      read: false
    },
    {
      id: 'msg_005',
      fromId: 'user_010',
      toId: 'user_006',
      content: '¡Perfecto David! Te espero en la gasolinera de la entrada del pueblo. ¡Gracias crack!',
      timestamp: '2026-05-26T20:10:00',
      read: true
    },
    {
      id: 'msg_006',
      fromId: 'user_009',
      toId: 'user_005',
      content: 'Ana, ¿vienes al concierto del viernes en La Térmica? Puedo recogerte en Fuengirola de camino.',
      timestamp: '2026-05-25T15:00:00',
      read: true
    },
    {
      id: 'msg_007',
      fromId: 'user_003',
      toId: 'user_007',
      content: 'Sofía, bienvenida a la UMA! Si necesitas apuntes de Derecho Romano, te los paso. Yo ya aprobé esa asignatura 😊',
      timestamp: '2026-05-24T17:00:00',
      read: true
    }
  ],

  // ---- Notificaciones pre-cargadas ----
  defaultNotifications: [
    {
      id: 'notif_001',
      userId: 'user_001',
      type: 'like',
      fromUserId: 'user_005',
      message: 'Ana López le ha dado like a tu publicación',
      relatedId: 'post_001',
      timestamp: '2026-05-26T11:00:00',
      read: false
    },
    {
      id: 'notif_002',
      userId: 'user_001',
      type: 'comment',
      fromUserId: 'user_008',
      message: 'Javier Torres ha comentado en tu publicación',
      relatedId: 'post_001',
      timestamp: '2026-05-26T10:45:00',
      read: false
    },
    {
      id: 'notif_003',
      userId: 'user_001',
      type: 'ride_request',
      fromUserId: 'user_005',
      message: 'Ana López quiere unirse a tu viaje Alhaurín → Teatinos',
      relatedId: 'ride_001',
      timestamp: '2026-05-25T08:00:00',
      read: true
    },
    {
      id: 'notif_004',
      userId: 'user_001',
      type: 'friend_request',
      fromUserId: 'user_007',
      message: 'Sofía Navarro quiere ser tu amiga',
      relatedId: null,
      timestamp: '2026-05-24T16:30:00',
      read: false
    },
    {
      id: 'notif_005',
      userId: 'user_001',
      type: 'event',
      fromUserId: null,
      message: 'Nuevo evento: Hackathon UMA 2026 - ¡No te lo pierdas!',
      relatedId: 'evt_005',
      timestamp: '2026-05-23T10:00:00',
      read: true
    }
  ],

  // ---- Pueblos y rutas de la provincia ----
  towns: [
    { name: 'Alhaurín de la Torre', distance: 18, zone: 'Valle del Guadalhorce' },
    { name: 'Alhaurín el Grande', distance: 30, zone: 'Valle del Guadalhorce' },
    { name: 'Álora', distance: 38, zone: 'Valle del Guadalhorce' },
    { name: 'Antequera', distance: 60, zone: 'Interior' },
    { name: 'Benalmádena', distance: 22, zone: 'Costa del Sol' },
    { name: 'Cártama', distance: 22, zone: 'Valle del Guadalhorce' },
    { name: 'Coín', distance: 33, zone: 'Valle del Guadalhorce' },
    { name: 'Estepona', distance: 82, zone: 'Costa del Sol' },
    { name: 'Fuengirola', distance: 30, zone: 'Costa del Sol' },
    { name: 'Marbella', distance: 57, zone: 'Costa del Sol' },
    { name: 'Mijas', distance: 30, zone: 'Costa del Sol' },
    { name: 'Nerja', distance: 52, zone: 'Axarquía' },
    { name: 'Rincón de la Victoria', distance: 12, zone: 'Axarquía' },
    { name: 'Ronda', distance: 100, zone: 'Serranía de Ronda' },
    { name: 'Torremolinos', distance: 15, zone: 'Costa del Sol' },
    { name: 'Torre del Mar', distance: 40, zone: 'Axarquía' },
    { name: 'Vélez-Málaga', distance: 36, zone: 'Axarquía' },
    { name: 'Campanillas', distance: 10, zone: 'Málaga' },
    { name: 'Málaga Centro', distance: 5, zone: 'Málaga' }
  ],

  campuses: [
    'Campus Teatinos (UMA)',
    'Campus El Ejido (UMA)',
    'Campus de Excelencia (UMA)'
  ],

  // ---- Métodos de utilidad ----
  init() {
    if (!localStorage.getItem(this.KEYS.USERS)) {
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(this.defaultUsers));
    }
    if (!localStorage.getItem(this.KEYS.POSTS)) {
      localStorage.setItem(this.KEYS.POSTS, JSON.stringify(this.defaultPosts));
    }
    if (!localStorage.getItem(this.KEYS.RIDES)) {
      localStorage.setItem(this.KEYS.RIDES, JSON.stringify(this.defaultRides));
    }
    if (!localStorage.getItem(this.KEYS.EVENTS)) {
      localStorage.setItem(this.KEYS.EVENTS, JSON.stringify(this.defaultEvents));
    }
    if (!localStorage.getItem(this.KEYS.MESSAGES)) {
      localStorage.setItem(this.KEYS.MESSAGES, JSON.stringify(this.defaultMessages));
    }
    if (!localStorage.getItem(this.KEYS.NOTIFICATIONS)) {
      localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify(this.defaultNotifications));
    }
  },

  // Generic CRUD
  getAll(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  },

  save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  getById(key, id) {
    const items = this.getAll(key);
    return items.find(item => item.id === id);
  },

  update(key, id, updates) {
    const items = this.getAll(key);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.save(key, items);
      return items[index];
    }
    return null;
  },

  add(key, item) {
    const items = this.getAll(key);
    items.push(item);
    this.save(key, items);
    return item;
  },

  remove(key, id) {
    const items = this.getAll(key);
    const filtered = items.filter(item => item.id !== id);
    this.save(key, filtered);
  },

  // Session management
  setSession(userId) {
    localStorage.setItem(this.KEYS.SESSION, userId);
  },

  getSession() {
    return localStorage.getItem(this.KEYS.SESSION);
  },

  clearSession() {
    localStorage.removeItem(this.KEYS.SESSION);
  },

  getCurrentUser() {
    const userId = this.getSession();
    if (!userId) return null;
    return this.getById(this.KEYS.USERS, userId);
  },

  // Reset to defaults
  resetAll() {
    Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
    this.init();
  },

  // Generate unique ID
  generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};
