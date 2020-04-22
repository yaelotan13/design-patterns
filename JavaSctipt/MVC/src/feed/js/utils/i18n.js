import i18next from 'i18next';

i18next.init({
  lng: 'en',
  debug: true,
  resources: {
    en: {
      translation: {
        'no posts': 'No posts to show just yet',
        'authority-error': 'Sorry, you are unauthorized to visit this page, please log in or create an account',
        'image pool key': '!imagesPool!',
        'post-not-found': 'Sorry, no posts were found',
        'posts-found': ' posts found',
        'add-content': 'Please add content to your blog',
        'header-already-exists': 'This header already exists, please choose a different name',
        'default-webpack-server-key': 'loglevel:webpack-dev-server',
        'post-1-header': 'Here Comes the Sun',
        'post-1-body': 'Here comes the sun (doo doo doo) \n'
                          + 'Here comes the sun, and I say \n'
                          + 'It\'s all right \n'
                          + 'Little darling, it\'s been a long cold lonely winter \n'
                          + 'Little darling, it feels like years since it\'s been here \n'
                          + 'Here comes the sun (doo doo doo) \n'
                          + 'Here comes the sun, and I say \n'
                          + 'It\'s all right \n',
        'post-2-header': 'Let it Be',
        'post-2-body': 'When I find myself in times of trouble, Mother Mary comes to me\n'
                          + 'Speaking words of wisdom, let it be\n'
                          + 'And in my hour of darkness she is standing right in front of me\n'
                          + 'Speaking words of wisdom, let it be\n'
                          + 'Let it be, let it be, let it be, let it be\n'
                          + 'Whisper words of wisdom, let it be\n',
        'post-3-header': 'Yesterday',
        'post-3-body': 'Yesterday, all my troubles seemed so far away\n'
                          + 'Now it looks as though they\'re here to stay\n'
                          + 'Oh, I believe in yesterday',
        'post-4-header': 'Help',
        'post-4-body': 'Help, I need somebody\n'
                          + 'Help, not just anybody\n'
                          + 'Help, you know I need someone, help',
        'image-pool': '../user-uploads/bike.jpg,../user-uploads/flower.png,../user-uploads/forest-bg.jpg,'
            + '../user-uploads/girl.jpg,../user-uploads/book-pink.jpeg,../user-uploads/colorful-flowers.png,'
          + '../user-uploads/colorful-mushrooms.jpg,../user-uploads/sun.jpg,../user-uploads/helping.jpg,'
          + '../user-uploads/happy-people.jpg,../user-uploads/old-school-car.jpg,../user-uploads/buildings.jpg,'
          + '../user-uploads/people-blue.png,../user-uploads/people-yellow.jpg,../user-uploads/ship-bg.jpg,'
          + '../user-uploads/sunglasses.jpg,../user-uploads/thinking.png',
      },
    },
  },
}, (err, t) => {
});
