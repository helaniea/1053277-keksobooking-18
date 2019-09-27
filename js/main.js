'use strict';

var TITLE = 'Апартаменты в центре Минска';
var TYPE_OPTIONS = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var CHECKOUT_TIMES = CHECKIN_TIMES;
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = 'Стильная квартира в жилом небоскребе Минска. Центр города, удобное транспортное сообщение. Охраняемая закрытая домовая территория, парковка, детская площадка. Рядом супермаркет.';
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var RANDOM_ADVERTS_AMOUNT = 8;
var MAP_OVERLAY_XSIZE = 1200;
var MAP_PIN_XSIZE = 50;
var PIN_ELEM_XSIZE = 50;
var PIN_ELEM_YSIZE = 70;

var getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
};

var getRandomAdvert = function (avatarNumber) {
  var randomAdvert = {
    author: {},
    offer: {},
    location: {},
  };
  randomAdvert.author.avatar = 'img/avatars/user{{x}}.png'.replace('{{x}}', String(0) + avatarNumber);
  randomAdvert.offer.title = TITLE;
  randomAdvert.offer.price = getRandomIntInclusive(3000, 15000);
  randomAdvert.offer.type = TYPE_OPTIONS[getRandomIntInclusive(0, TYPE_OPTIONS.length - 1)];
  randomAdvert.offer.rooms = getRandomIntInclusive(1, 4);
  randomAdvert.offer.guests = getRandomIntInclusive(1, 5);
  randomAdvert.offer.checkin = CHECKIN_TIMES[getRandomIntInclusive(0, CHECKIN_TIMES.length - 1)];
  randomAdvert.offer.checkout = CHECKOUT_TIMES[getRandomIntInclusive(0, CHECKOUT_TIMES.length - 1)];
  randomAdvert.offer.features = FEATURES.slice(0, getRandomIntInclusive(1, FEATURES.length));
  randomAdvert.offer.description = DESCRIPTION.slice(0, getRandomIntInclusive(0, DESCRIPTION.length - 1));
  randomAdvert.offer.photos = PHOTOS.slice(0, getRandomIntInclusive(1, PHOTOS.length));
  randomAdvert.location.x = getRandomIntInclusive(0, MAP_OVERLAY_XSIZE - MAP_PIN_XSIZE);
  randomAdvert.location.y = getRandomIntInclusive(130, 630);
  randomAdvert.offer.address = '{{location.x}}, {{location.y}}'.replace('{{location.x}}, {{location.y}}', randomAdvert.location.x + ',' + ' ' + randomAdvert.location.y);

  return randomAdvert;
};

var getRandomSpecsArr = function () {
  var randomAdverts = [];
  for (var i = 1; i <= RANDOM_ADVERTS_AMOUNT; i++) {
    var randomAdvert = getRandomAdvert(i);
    randomAdverts.push(randomAdvert);
  }
  return randomAdverts;
};

var randomAdverts = getRandomSpecsArr();
var map = document.querySelector('.map');
map.classList.remove('map--faded');

var similarPinElement = map.querySelector('.map__pins');

var similarAdvertTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');

var similarPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var renderAdvert = function (advert) {
  var advertElement = similarAdvertTemplate.cloneNode(true);

  advertElement.querySelector('.popup__avatar').src = advert.author.avatar;
  advertElement.querySelector('.popup__title').textContent = advert.offer.title;
  advertElement.querySelector('.popup__text--address').textContent = advert.offer.address;
  advertElement.querySelector('.popup__text--price').innerHTML = advert.offer.price + '&#x20bd;<span>/ночь</span>';
  advertElement.querySelector('.popup__type').textContent = advert.offer.type;
  advertElement.querySelector('.popup__text--capacity').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
  advertElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
  var mainFeatures = advertElement.querySelector('.popup__features');
  var randomFeature = advertElement.querySelectorAll('.popup__feature');
  for (var i = randomFeature.length; i > advert.offer.features.length; i--) {
    mainFeatures.removeChild(randomFeature[i - 1]);
  }
  advertElement.querySelector('.popup__description').textContent = advert.offer.description;
  advertElement.querySelector('.popup__photo').src = advert.offer.photos[0];
  for (var j = 1; j < advert.offer.photos.length; j++) {
    var mainPhotos = advertElement.querySelector('.popup__photos');
    var randomPhoto = advertElement.querySelector('.popup__photo');
    var randomPhotoClone = randomPhoto.cloneNode(true);
    mainPhotos.appendChild(randomPhotoClone);
    randomPhotoClone.src = advert.offer.photos[j];
  }
  return advertElement;
};

var renderPin = function (pin) {
  var pinElement = similarPinTemplate.cloneNode(true);
  pinElement.style.left = (pin.location.x - PIN_ELEM_XSIZE / 2) + 'px';
  pinElement.style.top = (pin.location.y - PIN_ELEM_YSIZE) + 'px';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;
  return pinElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < randomAdverts.length; i++) {
  fragment.appendChild(renderAdvert(randomAdverts[i]));
  fragment.appendChild(renderPin(randomAdverts[i]));
}
similarPinElement.appendChild(fragment);
