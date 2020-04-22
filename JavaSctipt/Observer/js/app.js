const colorManager = (function() {
  const _initColorArray = () => {
    _colorArray = ['aqua', 'salmon', 'royalblue', 'teal', 'yellowgreen', 'orchid', 'palevioletred',
      'lime', 'hotpink', 'firebrick', 'darkblue', 'navy'];
  }

  let _colorArray = [];

  const getNextRandomColor = () => {
    if (_colorArray.length === 0) {
      _initColorArray();
    }

    const randIndex = Math.floor(Math.random() * _colorArray.length);
    const chosenColor = _colorArray[randIndex];
    _colorArray.splice(randIndex, 1);
    return chosenColor;
  }

  return {
    getNextRandomColor: getNextRandomColor,
  }
})();

const subject = (function() {
  let _observers = [];

  const subscribe = (element) => {
    _observers.push(element);
  }

  const unsubscribe = (element) => {
    _observers = _observers.filter(subscriber => subscriber !== element);
  }

  const notify = (data) => {
    _observers.forEach(observer => observer.receive(data));
  }

  return {
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    notify: notify,
  }
})();

class Observer {
  constructor(element) {
    this.element = element;
  }

  receive(color) {
    this.element.style.border = `2px solid ${color}`;
    this.element.style.color = `${color}`;
    this.element.innerHTML = `${color}`;
  }
}

const initElements = () => {
  const box1 = new Observer(document.getElementById('box-1'));
  const box2 = new Observer(document.getElementById('box-2'));
  const box3 = new Observer(document.getElementById('box-3'));
  return [box1, box2, box3];
}

const onButtonClicked = () => {
  const color = colorManager.getNextRandomColor();
  subject.notify(color);
}

const subscribeElements = () => {
  [box1, box2, box3] = initElements();
  subject.subscribe(box1);
  subject.subscribe(box2);
  subject.subscribe(box3);
}

document.getElementById('click-me-but').addEventListener('click', onButtonClicked);
window.addEventListener('load', subscribeElements);