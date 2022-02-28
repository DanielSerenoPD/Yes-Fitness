export const generarCodigoCupon = () => {
  var text = '';
  var possible2 = '0123456789';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  for (var i = 0; i < 5; i++) {
    if (i < 3) {
      text += possible2.charAt(Math.floor(Math.random() * possible2.length));
    } else {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  }

  return text;

  //output ej: 141Ld
};

//ORIGINAL
// export const generarCodigoCupon = () => {
//   var text = '';
//   var possible =
//     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//   for (var i = 0; i < 5; i++)
//     text += possible.charAt(Math.floor(Math.random() * possible.length));

//   return text;
// };
