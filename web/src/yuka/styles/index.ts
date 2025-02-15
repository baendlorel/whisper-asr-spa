Object.entries(import.meta.glob('./*.sass')).forEach(([, value]) => {
  value();
});
