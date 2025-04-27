# Guia de instalación y uso.
Esta guía está destinada para los desarrolladores de la aplicación YIM.

## Instalación:
Para instalar la aplicación, es necesario clonar el repositorio de forma local para poder agregar el trabajo de desarrollo en nuevas iteraciónes. se puede encontrar el repositorio en el siguiente link: https://github.com/Remembranza/yim_app

## Compilación:
Una vez clonado el repositorio de forma local, se deben de ejecutar los siguientes comandos:

1. `npm install -g @ionic/cli`
2. `npm install -g @angular/cli`

> ✅ **Nota:**  
> Además de los comandos anteriores, todas las dependencias necesarias para compilar y ejecutar la aplicación deben de estar presentes.  
>## 🚀 Requisitos para ejecutar la app Ionic
>- ✅ Node.js instalado (recomendado: v18.x o superior)
>- 🔄 Ejecutar `npm install` para instalar dependencias
>- ✅ Ionic CLI (`npm install -g @ionic/cli`)
>- 🛠️ Tener Android Studio o Xcode configurado
>- 🧱 Ejecutar `ionic build` antes de `ionic cap copy`
> 💡 Usa `ionic info` para verificar que todo esté en orden.

## Ejecución:
Una vez se pueda compilar la aplicación, se debe usar `ionic serve` para ejecutar la aplicación

## Método de desarrollo:
Para mantener la integridad de la aplicación, las actividades de desarrollo deben mantenerse fuera de la rama `main` ya que esta debe contener una versión estable de la aplicación. 

El desarrollo debe basarse en el contenido de la rama `dev` y a su vez, se recomienda que cada desarrollador cree una rama personal para realizar sus propios cambios utilizando el formato `dev - nombre`. 

Para integrar los cambios de la rama de desarrollo personal a la rama `dev`, se debe de asegurar de hacer una correcta integración del contenido de ambas ramas por medio del proceso `merge` de git. De esta forma, se asegura que no existan conflictos dentro de la rama `dev`.

Una vez se hayan integrado todas las ramas de desarrollo personal en `dev`, y esta rama tenga una versión estable de a aplicación, se puede llevar a cabo el mismo proceso de `merge` con la rama `main` del repositorio. 