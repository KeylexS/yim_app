# YIM App

Aplicación de aprendizaje interactivo construida con Ionic y Angular.

## Dependencias Principales

- **Angular 17** - Framework frontend
- **Ionic Framework 7** - Framework móvil para iOS/Android
- **Capacitor** - Acceso a APIs nativas
- **TypeScript** - Lenguaje de programación
- **Ionicons** - Icono library

## Instalación

1. Clonar el repositorio: `git clone https://github.com/Remembranza/yim_app.git`
2. Instalar dependencias: `npm install`
3. Ejecutar: `npm start` o `ionic serve`

## Estructura del Proyecto

### `/src/app/pages/`
Páginas principales de la aplicación:
- **welcome-page** - Pantalla de bienvenida inicial
- **home-page** - Dashboard principal
- **classes-list** - Lista de clases disponibles
- **activity** - Ejecutor de actividades
- **completed-classes** - Clases completadas
- **achievements** - Insignias y logros

### `/src/app/components/`
Componentes reutilizables para actividades:
- **multiple-choice** - Preguntas de opción múltiple
- **typing** - Ejercicios de escritura
- **match-image** - Juego de coincidencia de imágenes
- **match-pairs** - Emparejamiento de pares
- **achievement-toast** - Notificación de logros desbloqueados

### `/src/app/services/`
Servicios para lógica de negocio:
- **achievement.service** - Gestión de logros y gamificación
- **progress.service** - Seguimiento del progreso del usuario
- **cache.service** - Almacenamiento en caché local