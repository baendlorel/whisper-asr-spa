Object.entries(import.meta.glob('./*.css')).forEach(([, value]) => {
  value();
});
