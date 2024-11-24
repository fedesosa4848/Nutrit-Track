# NutriTrack - Aplicación Nutricional

Este es el proyecto final para la Universidad Tecnológica Nacional (UTN), desarrollado por Fausto Fuertes, Federico Sosa, Iván Badoza, Santiago Camarda e Ignacio Volpe. El proyecto es una aplicación nutricional que permite a los usuarios gestionar sus comidas diarias y tener un mayor control sobre la ingesta de macronutrientes.

## Desarrolladores

- Fausto Fuertes [LinkedIn](https://www.linkedin.com/in/fausto-fuertes-667986254/)
- Federico Sosa - [LinkedIn](https://www.linkedin.com/in/federico-sosa-533512239/)
- Iván Badoza - [LinkedIn](https://www.linkedin.com/in/ivan-badoza-5995bb337/)
- Santiago Camarda
- Ignacio Volpe

## Instalación y Uso

### Clonar el Repositorio
Para comenzar, clona el repositorio a tu máquina local usando:
```sh
$ git clone https://github.com/faustofuertes/nutriTrack.git
```


Luego, accede a la carpeta del proyecto:
```sh
$ cd nutriTrack
```

### Instalar Dependencias
Una vez dentro del proyecto, instala las dependencias necesarias:

```sh
$ npm install
```


### Correr los Endpoints

Para correr los endpoints, debes iniciar dos instancias del servidor `json-server`, una para el servicio de las comidas y usuarios, y otra para el servicio de los mensajes. Asegúrate de que estés en el directorio raíz del proyecto y ejecuta los siguientes comandos en dos terminales diferentes:

1. Para el servicio de comidas y usuarios, donde se usa el archivo `db.json`:

   ```sh
   $ json-server --watch db.json --port 3000
   ```

2. Para el servicio de mensajes, donde se usa el archivo `dbMensajes.json`:

   ```sh
   $ json-server --watch dbMensajes.json --port 3001
   ```

De esta manera, tendrás ambos servicios corriendo en puertos diferentes, uno para las comidas/usuarios en el puerto 3000 y otro para los mensajes en el puerto 3001.



### Levantar la Aplicación
Finalmente, para levantar la aplicación Angular, ejecuta:
```sh
$ ng serve -o
```
Esto abrirá la aplicación en tu navegador predeterminado.

## Contribución
Las contribuciones son bienvenidas. Si deseas contribuir a este proyecto, sigue estos pasos:

1. Haz un 'Fork' del proyecto.
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`).
3. Realiza tus cambios y haz un 'commit' (`git commit -m 'Add some AmazingFeature'`).
4. Sube tu rama (`git push origin feature/AmazingFeature`).
5. Abre un 'Pull Request'.

## Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
