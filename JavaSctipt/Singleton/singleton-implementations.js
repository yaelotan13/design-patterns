const EagerSingleton = (function () {
  const _Singleton = function () {
    this.numInstances = 0;
    ++this.numInstances;
  }

  const _instance = new _Singleton();
  const getInstance = () => {
      return _instance;
  }

  return {
    getInstance: getInstance,
  }
})();

const LazySingleton = (function () {
  let _instance;

  const _Singleton = function () {
    this.numInstances = 0;
    ++this.numInstances;
  }

  const getInstance = () => {
    if (!_instance) {
      _instance = new _Singleton();
    }

    return _instance;
  }

  return {
    getInstance: getInstance,
  }
})();


let SelfDefiningSingleton = function () {
  let _instance = this;
  this.numInstances = 0;
  ++this.numInstances;

  SelfDefiningSingleton = function () {
    return _instance;
  };

  return _instance;

};

let LazySelfDefining;
(function () {
  let _instance;
  LazySelfDefining = function () {
    if (!_instance) {
      _instance = this;
      this.numInstances = 0;
      ++this.numInstances;
    }

    return _instance;
  }

}());

const eagerSingletonInstance = EagerSingleton.getInstance();
console.log('eager initialization - num instances FIRST instance of EagerSingleton: ' + eagerSingletonInstance.numInstances);
const anotherEagerSingletonInstance = EagerSingleton.getInstance();
console.log('eager initialization - num instances SECOND instance of EagerSingleton: ' + anotherEagerSingletonInstance.numInstances);

const lazySingletonInstance = LazySingleton.getInstance();
console.log('lazy initialization - num instances FIRST instance of LazySingleton: ' + lazySingletonInstance.numInstances);
const anotherLazySingletonInstance = LazySingleton.getInstance();
console.log('lazy initialization - num instances SECOND instance of LazySingleton: ' + anotherLazySingletonInstance.numInstances);

const selfDefiningSingletonInstance = SelfDefiningSingleton();
console.log('self defining pattern - num instances FIRST instance of SelfDefiningSingleton: ' + selfDefiningSingletonInstance.numInstances);
const anotherSelfDefiningSingletonInstance = SelfDefiningSingleton();
console.log('self defining pattern - num instances SECOND instance of SelfDefiningSingleton: ' + anotherSelfDefiningSingletonInstance.numInstances);

const lazySelfDefiningSingletonInstance = LazySelfDefining();
console.log('lazy self defining pattern - num instances FIRST instance of SelfDefiningSingleton: ' + lazySelfDefiningSingletonInstance.numInstances);
const lazyAnotherSelfDefiningSingletonInstance = LazySelfDefining();
console.log('lazy self defining pattern - num instances SECOND instance of SelfDefiningSingleton: ' + lazyAnotherSelfDefiningSingletonInstance.numInstances);