# Yes-Fitness
1. Configurar Cliente:

Abrimos una terminal o consola en la raiz de nuestro proyecto e instalamos las dependencias con npm i / yarn install dependiendo nuestro SO.

En la carpeta client/src/app.js cambiar la clave stripe publishable por la de la cuenta yes fitness

En la carpeta cliente/src/actions/constant.js cambiar el valor de la constante 'URL' por la del servidor donde almacenaran la api.

2. Configurar Api:

Abrimos una terminal o consola en la raiz de nuestro proyecto e instalamos las dependencias con npm i / yarn install dependiendo nuestro SO.

En la ruta raiz del proyecto se deben de crear dos archivos .env para las variables de entorno. A continuacion muestro
ejemplos de configuracion de ambos archivos.

Archivo 1

.env

PUBLISHABLE = clave publica de stripe

PRIVATE = clave privada stripe

PORT =  puerto para correr el servidor

Archivo 2

.env.json

{

aqui copean las credenciales de firebase.

}

Opcionalmente si se les complica configurar las variables de entorno en formato json en su servidor,
se puede almacenar las credenciales de firebase en el directorio raiz de la api. El server viene comentada la forma
en la que se puede utilizar las credenciales de esta manera. simplemente vayan a la carpeta firebase en la api, abran index
y descomenten las siguientes lineas.

initializeApp({

    credential:cert(key)
    
});

Otro paso necesario es renombrar el archivo de las credenciales, cambiar el nombre por 'yes-fitness'.

                            COMO GENERAR CREDENCIALES DE FIREBASE
1. Abrir consola firebase
2. Configuraciones del proyecto
3. Cuentas de servicio
4. Generar nueva clave privada
