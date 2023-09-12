const fakeClickDispatcher = () => {
  const fakeClick = document.getElementById("fakeEvent");
  fakeClick?.focus();
};
export { fakeClickDispatcher };
