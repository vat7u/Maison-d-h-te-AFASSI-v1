/*
  !!! TEMPORARY DEVELOPMENT CONTENT — NOT REAL GUEST REVIEWS !!!

  Every review in this file is FICTIONAL. The names, countries and texts were invented
  only to test the layout: different lengths, ratings, platforms and languages,
  including Arabic right-to-left text. Do not publish them as genuine testimonials.

  While `isMock` is true, each card is labelled "Exemple / Example / Ejemplo / مثال".

  TO USE REAL REVIEWS
    1. Replace the `reviews` list with real, authorised reviews (same fields as below).
    2. Set `isMock: false` — the "Example" labels disappear.
    (You can also rename this file to reviews-data.js; then update its <script> tag
    in index.html.)

  Fields of each review
    id        any unique text
    platform  "google", "expedia" or "booking" — must match a key in ratings.js
    lang      language the review was ORIGINALLY written in: "fr", "en", "es" or "ar".
              The section shows only reviews whose lang matches the site language;
              reviews are never translated.
    name      reviewer's name as shown on the platform
    country   two-letter country code (ISO 3166), e.g. "FR", "MA" — shown as a flag
              and a country name in the site language
    rating    the reviewer's score, on the platform's scale (out of 5 for Google,
              out of 10 for Expedia and Booking.com)
    text      the review text, exactly as written
*/
window.AFASSI_REVIEWS = {
  isMock: true,
  reviews: [
    // — French (fictional) —
    { id: 'mock-fr-1', platform: 'google', lang: 'fr', name: 'Camille D.', country: 'FR', rating: 5,
      text: "Un accueil d'une chaleur rare. La terrasse au coucher du soleil, le thé à la menthe et les conseils pour visiter la médina : tout était parfait." },
    { id: 'mock-fr-2', platform: 'booking', lang: 'fr', name: 'Julien M.', country: 'BE', rating: 9.6,
      text: "Nous avons passé quatre nuits à la maison d'hôtes et nous avions du mal à repartir. La chambre était impeccable, fraîche malgré la chaleur de l'après-midi et décorée avec beaucoup de goût. Le petit-déjeuner servi sur la terrasse, face aux montagnes, est un vrai moment de bonheur : msemen tout chaud, miel, fromage de chèvre et jus d'orange pressé. Notre hôte nous a aussi indiqué une randonnée vers Akchour que nous n'aurions jamais trouvée seuls. Seul petit bémol : les escaliers sont raides avec de grosses valises, mais cela fait partie du charme de la médina." },
    { id: 'mock-fr-3', platform: 'expedia', lang: 'fr', name: 'Sophie L.', country: 'CA', rating: 10,
      text: 'Calme, propre et idéalement situé. À refaire !' },
    { id: 'mock-fr-4', platform: 'google', lang: 'fr', name: 'Nadia B.', country: 'MA', rating: 4,
      text: "Très belle maison et équipe adorable. Le garage fermé pour la moto est un vrai plus. Le Wi-Fi était un peu lent dans notre chambre, mais nous étions là pour déconnecter." },

    // — English (fictional) —
    { id: 'mock-en-1', platform: 'google', lang: 'en', name: 'Emily R.', country: 'GB', rating: 5,
      text: 'A little blue jewel in the heart of the medina. Our hosts made us feel like family from the moment we arrived, and the rooftop view at sunset is unforgettable.' },
    { id: 'mock-en-2', platform: 'booking', lang: 'en', name: 'Daniel K.', country: 'US', rating: 9.2,
      text: "We rode in on two motorcycles after a long day through the Rif and were thrilled to find a locked garage right next to the house. The rooms are simple but full of character, with handmade tiles and comfortable beds. Breakfast was generous and different every morning. The staff helped us plan a route towards the coast for the next day and even called ahead to check the road conditions. The only reason this isn't a perfect score is that the street can be a little noisy in the early evening, but it settles down quickly. Highly recommended for anyone touring Morocco by bike." },
    { id: 'mock-en-3', platform: 'expedia', lang: 'en', name: 'Liam O.', country: 'IE', rating: 8.8,
      text: 'Great value, lovely people, perfect location.' },

    // — Spanish (fictional) —
    { id: 'mock-es-1', platform: 'booking', lang: 'es', name: 'Lucía G.', country: 'ES', rating: 10,
      text: 'Una casa preciosa y un trato inmejorable. Nos sentimos como en casa desde el primer momento. El desayuno en la terraza, con vistas a las montañas, fue lo mejor del viaje.' },
    { id: 'mock-es-2', platform: 'google', lang: 'es', name: 'Mateo R.', country: 'AR', rating: 5,
      text: 'Viajamos en moto desde Tánger y elegimos esta casa por el garaje cerrado, pero lo que nos conquistó fue la gente. El anfitrión nos recomendó rutas por el Rif, restaurantes donde comen los vecinos y el mejor momento para subir a la mezquita española sin multitudes. La habitación era amplia, limpia y muy tranquila por la noche. Volveremos sin duda en nuestro próximo viaje por Marruecos.' },
    { id: 'mock-es-3', platform: 'expedia', lang: 'es', name: 'Valentina C.', country: 'MX', rating: 9.4,
      text: 'Limpio, tranquilo y con unas vistas increíbles.' },

    // — Arabic (fictional) —
    { id: 'mock-ar-1', platform: 'google', lang: 'ar', name: 'سارة م.', country: 'MA', rating: 5,
      text: 'استقبال رائع وأجواء هادئة في قلب المدينة القديمة. الإطلالة من السطح عند الغروب لا تُنسى، والشاي بالنعناع كان لذيذًا جدًا.' },
    { id: 'mock-ar-2', platform: 'booking', lang: 'ar', name: 'أحمد ك.', country: 'AE', rating: 9.8,
      text: 'قضينا ثلاث ليالٍ في دار الضيافة وكانت التجربة أفضل مما توقعنا. الغرفة نظيفة ومريحة ومزينة بلمسات مغربية تقليدية جميلة. الفطور يُقدَّم على السطح مع إطلالة على جبال الريف، وكان متنوعًا وطازجًا كل صباح. ساعدنا المضيف في تنظيم جولة في المدينة الزرقاء وأعطانا نصائح قيّمة عن المطاعم والأماكن الهادئة بعيدًا عن الزحام. نوصي بها بشدة للعائلات ولكل من يبحث عن الراحة والضيافة الأصيلة.' },
    { id: 'mock-ar-3', platform: 'expedia', lang: 'ar', name: 'ليلى ح.', country: 'EG', rating: 9,
      text: 'مكان جميل ونظيف وموقع ممتاز.' },
  ],
};
