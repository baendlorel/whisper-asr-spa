var colors = {
  $primary: '#3876c6',
  $secondary: '#6c757d',
  $success: '#198754',
  $info: '#0dcaf0',
  $warning: '#ffc107',
  $danger: '#dc3545',
  $light: '#f8f9fa',
  $dark: '#212529',
  $blue: '#0d6efd',
};
var t = [];
for (const k in colors) {
  t.push(`${k}: ${colors[k]}`);
}
for (const k in colors) {
  t.push(`${k}-light: light(${k})`);
  // t.push(`${k}-light: saturate(lighten(${k},$lr),$ls)`);
}
for (const k in colors) {
  t.push(`${k}-lighter: lighter(${k})`);
  // t.push(`${k}-lighter: saturate(lighten(${k},$lrp),$lsp)`);
}
console.log(t.join('\n'));
