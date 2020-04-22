const localStorageCRUD = (() => {
  const create = (key, value) => {
    localStorage.setItem(key, value);
  };

  const read = key => localStorage.getItem(key);

  const update = (key, newValue) => {
    localStorage.setItem(key, newValue);
  };

  const deleteOp = (key) => {
    localStorage.removeItem(key);
  };

  return {
    create,
    read,
    update,
    deleteOp,
  };
})();

export default localStorageCRUD;
