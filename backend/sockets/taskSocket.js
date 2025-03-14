let io;

const setIoInstance = (instance) => {
  io = instance;
};

const getIoInstance = () => {
  return io;
};

module.exports = {
  setIoInstance,
  getIoInstance,
};