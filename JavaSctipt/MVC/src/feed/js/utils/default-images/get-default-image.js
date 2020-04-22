const images = [
  './uploads/bike.jpg',
  './uploads/desert-blue',
  './uploads/girl.png',
  './uploads/happy-people.jpg',
  './uploads/helping.jpg',
];

function getRandomImage() {
  const randIndex = Math.floor(Math.random() * images.length);
  const chosenImage = images[randIndex];
  images.splice(chosenImage, 1);

  return chosenImage;
}

export default getRandomImage;
