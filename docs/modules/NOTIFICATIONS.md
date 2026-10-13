# Módulo de Notificaciones - Arquitectura, Implementación y Roadmap

> **Ubicación:** `docs/modules/NOTIFICATIONS.md`  
> **Proyecto:** Winnix (Frontend `winnix-fr` y Backend `winnix-backend`)  
> **Última actualización:** Octubre 2026  
> **Estado:** MVP Base Implementado / Listo para conectar disparadores de eventos restantes

---

## 1. Visión General del Módulo

El sistema de notificaciones de Winnix es un **centro de avisos efímero, desacoplado y reactivo**. Su propósito es mantener informados a organizadores, capitanes y jugadores sobre eventos clave en torneos, equipos y partidos, además de permitir resolver solicitudes de acción directa (como aceptar o rechazar solicitudes de unión).

### Principios de Diseño
1. **Limpieza 100% Automática (TTL de MongoDB):** Las notificaciones tienen una vida útil de **30 días**. No requieren mantenimiento manual ni botones de borrado individual. MongoDB purga los registros expirados de manera nativa en segundo plano.
2. **Acción de Usuario Simplificada:** La bandeja cuenta únicamente con la acción **"Marcar todas como leídas"**. No existen tachos de basura manuales en las tarjetas.
3. **Paginación Infinita Optimizada:** Carga de **15 notificaciones más recientes** por página mediante `@tanstack/react-query` (`useInfiniteQuery`), reduciendo el consumo de memoria y red.
4. **Desacoplamiento de Rutas:** El backend **no almacena rutas quemadas de frontend**. Almacena la categoría, el tipo y metadatos (`tournamentId`, `teamId`, etc.), permitiendo que el frontend decida cómo presentar la información o navegar sin riesgo de rutas rotas.
5. **Acciones Exclusivas en Modal Reutilizable:** Las notificaciones interactivas (`actionRequired: true`) resuelven su flujo dentro de un **modal custom responsivo** con botones al 100% de ancho apilados verticalmente.
6. **Soporte Nativo y Háptico:** Integrado con feedback de vibración física (`expo-haptics`) y preparado con arquitectura de adaptadores para notificaciones push (`expo-notifications`) sin comprometer el desarrollo local en Expo Go.

---

## 2. Lo que se Implementó: Backend (`winnix-backend`)

### 2.1 Entidad y Esquema de MongoDB (`notification.entity.ts`)
* **Archivo:** `src/notifications/entities/notification.entity.ts`
* **Colección:** `notifications`
* **Campos principales:**
  * `recipient`: `ObjectId` del usuario destinatario (referencia a `User`).
  * `sender`: `ObjectId` del usuario que originó la acción (opcional).
  * `type`: Enum `NotificationType` con los eventos del sistema.
  * `category`: Enum `NotificationCategory` (`TOURNAMENT`, `TEAM`, `MATCH`, `SYSTEM`).
  * `title`: Título visible (ej. *"¡Bienvenido a Winnix!"*).
  * `message`: Contenido descriptivo del aviso.
  * `data`: Objeto flexible de metadatos (`tournamentId`, `teamId`, `matchId`, etc.).
  * `isRead`: Booleano para control de estado de lectura.
  * `actionRequired`: Booleano que indica si requiere respuesta del usuario.
  * `actionStatus`: `PENDING`, `ACCEPTED`, `REJECTED`, `EXPIRED`.
  * `actionPayload`: Información contextual para procesar la acción.
  * `createdAt` / `updatedAt`: Marcas de tiempo de Mongoose.

* **Índices de Rendimiento y TTL:**
  ```typescript
  // 1. Consulta rápida por usuario ordenada por fecha reciente
  NotificationSchema.index({ recipient: 1, createdAt: -1 });

  // 2. Conteo instantáneo de badge no leídas
  NotificationSchema.index({ recipient: 1, isRead: 1 });

  // 3. TTL Nativo de MongoDB: eliminación automática a los 30 días
  NotificationSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 30 * 24 * 60 * 60 }
  );
  ```

### 2.2 Servicio de Notificaciones (`notifications.service.ts`)
* **Archivo:** `src/notifications/notifications.service.ts`
* **Métodos principales:**
  * `create(createNotificationDto)`: Crea y persiste una nueva notificación en la base de datos.
  * `findByUser(userId, query)`: Obtiene notificaciones paginadas (15 por página), con límite de ventana móvil de 30 días (`createdAt: { $gte: thirtyDaysAgo }`), soporte de filtro por categoría (`category`) y solo no leídas (`unreadOnly`).
  * `getUnreadCount(userId)`: Cuenta eficiente de notificaciones pendientes de lectura en los últimos 30 días.
  * `markAsRead(id, userId)`: Marca una notificación individual como leída.
  * `markAllAsRead(userId)`: Marca todas las notificaciones pendientes del usuario como leídas.
  * `respondAction(id, userId, action)`: Cambia el estado de una notificación con acción a `ACCEPTED` o `REJECTED` y la marca como leída.
  * `createWelcomeNotification(userId, userName)`: Genera automáticamente la notificación de bienvenida para nuevos usuarios registrados.

### 2.3 Endpoints Expuestos (`notifications.controller.ts`)
* **Ruta Base:** `/notifications` (Protegido por `@UseGuards(AuthGuard())`)
  * `GET /notifications`: Listado paginado con filtros de categoría y no leídas.
  * `GET /notifications/unread-count`: Cantidad total de no leídas para insignias/badges.
  * `PATCH /notifications/mark-all-read`: Marcar todo el buzón como leído.
  * `PATCH /notifications/:id/read`: Marcar una notificación individual como leída.
  * `POST /notifications/:id/respond`: Responder a una solicitud interactiva (`{ action: 'ACCEPT' | 'REJECT' }`).

### 2.4 Primera Notificación Conectada: Bienvenida
* **Archivo:** `src/user/user.service.ts`
* Se inyectó `NotificationsService` en `UsersService`.
* Tanto en el registro por formulario (`email` / `password`) como en el registro mediante **Google OAuth**, se dispara automáticamente `createWelcomeNotification`:
  ```typescript
  // Disparo automático al crear cuenta
  this.notificationsService.createWelcomeNotification(user._id.toString(), user.name);
  ```

---

## 3. Lo que se Implementó: Frontend (`winnix-fr`)

### 3.1 Capa de Dominio y Acciones (`core/notifications/`)
* **Interfaces (`core/notifications/interface/notification.interface.ts`):** Modelado tipado de `NotificationItem`, `NotificationCategory`, `NotificationType`, `PaginatedNotificationsResponse`.
* **Acciones API (`core/notifications/actions/notifications-actions.ts`):** Peticiones Axios centralizadas:
  * `getNotificationsAction({ page, limit, category, unreadOnly })`
  * `getUnreadCountAction()`
  * `markAsReadAction(id)`
  * `markAllAsReadAction()`
  * `respondNotificationAction(id, action)`
* **Adaptador Nativo (`core/notifications/adapters/native-notifications.adapter.ts`):**
  * Disparo de vibraciones hápticas (`expo-haptics`) según el tipo de interacción (`success`, `warning`, `error`, `light`, `medium`).
  * Actualización del contador en el ícono de la app (`updateAppIconBadgeCount`).
  * Métodos preparados y comentados para notificaciones locales/push (`scheduleLocalNativeNotification`, `requestNativePermissions`).

### 3.2 Componentes Custom Reutilizables (`presentation/components/customs/`)
1. **`CustomAlert.tsx`:** Modal global de alerta con botones full-width (100% ancho) apilados verticalmente (Confirmar arriba, Cancelar abajo).
2. **`CustomModal.tsx`:** Modal base responsivo (92% ancho en móviles, máximo 520px en tablets/web) con soporte para degradados `LinearGradient` mediante `StyleSheet.absoluteFill` para evitar colapsos de altura en el motor de diseño de React Native.
3. **`NotificationModal.tsx`:** Modal de detalle de notificación con tipografía ampliada (Título 21px, Cuerpo 15.5px), chip de categoría, fecha relativa/absoluta y botonera apilada de ancho completo (Aceptar/Fichar, Rechazar, Ver Torneo, Cerrar).

### 3.3 Custom Hook Centralizado (`presentation/hooks/notifications/useNotifications.ts`)
Gestiona toda la reactividad del módulo con `@tanstack/react-query`:
* **Paginación Infinita (`useInfiniteQuery`):** Trae páginas de 15 notificaciones, calcula dinámicamente `hasNextPage` y concatena las páginas sin duplicar estados locales.
* **Badges y Contadores (`useQuery`):** Sincroniza el badge del header y el ícono de la app con `unreadCount`.
* **Mutaciones Optimizadas:** Invalida automáticamente la caché de React Query tras marcar como leída o responder una acción, emitiendo respuesta háptica inmediata.

### 3.4 Vista Principal (`presentation/notifications/NotificationsView.tsx`)
* **Header:** Título `NOTIFICACIONES`, contador de no leídas y botón `"Marcar leídas"`.
* **Chips de Filtro:** Filtros por categoría (`TODAS`, `NO LEÍDAS`, `TORNEOS`, `EQUIPOS`, `PARTIDOS`, `SISTEMA`).
* **Lista Dinámica:** `FlatList` con `refreshing` (pull-to-refresh), `onEndReachedThreshold={0.4}` para scroll infinito continuo y `ListEmptyComponent` estilizado cuando no hay notificaciones.
* **Tarjetas Limpias (`NotificationItemCard.tsx`):**
  * Sin tachos de basura ni acciones intrusivas en la lista.
  * Muestra el badge `"Requiere respuesta · Toca para responder"` cuando corresponda.
  * Al tocar la tarjeta, se marca como leída y abre el `NotificationModal`.

---

## 4. Estructura de Archivos del Módulo

```text
winnix-backend/
└── src/
    ├── notifications/
    │   ├── dto/
    │   │   ├── create-notification.dto.ts
    │   │   └── query-notifications.dto.ts
    │   ├── entities/
    │   │   └── notification.entity.ts           # Schema con TTL Index (30 días)
    │   ├── notifications.controller.ts          # Endpoints REST
    │   ├── notifications.module.ts
    │   └── notifications.service.ts             # Lógica de creación, consulta y TTL
    └── user/
        └── user.service.ts                      # Disparador de bienvenida

winnix-fr/
├── core/
│   └── notifications/
│       ├── actions/
│       │   └── notifications-actions.ts         # Axios actions
│       ├── adapters/
│       │   └── native-notifications.adapter.ts  # Haptics & Notificaciones nativas
│       └── interface/
│           └── notification.interface.ts        # Tipos TS
└── presentation/
    ├── components/
    │   └── customs/
    │       ├── CustomAlert.tsx                  # Alerta con botones 100% width
    │       ├── CustomModal.tsx                  # Modal responsivo base
    │       └── NotificationModal.tsx            # Modal de detalle y acciones
    ├── hooks/
    │   └── notifications/
    │       └── useNotifications.ts              # Hook infinito (15 por página)
    └── notifications/
        ├── NotificationsView.tsx                # Pantalla principal
        └── components/
            ├── NotificationEmptyState.tsx
            ├── NotificationFilterChips.tsx
            └── NotificationItemCard.tsx
```

---

## 5. Roadmap: Lo que Hace Falta por Implementar

A continuación se listan las notificaciones y conexiones que se deben ir agregando en orden:

### Paso 1: Notificaciones de Torneos (`category: 'TOURNAMENT'`)
| Evento | Tipo (`NotificationType`) | Destinatario | Requiere Acción | Acción al Responder |
| :--- | :--- | :--- | :--- | :--- |
| Equipo solicita unirse a un torneo | `TOURNAMENT_TEAM_JOIN_REQUEST` | Organizador del torneo | **Sí** | Aceptar aprueba la inscripción; Rechazar la deniega. |
| Jugador libre solicita unirse a un torneo | `TOURNAMENT_PLAYER_JOIN_REQUEST` | Organizador del torneo | **Sí** | Aceptar asigna cupo al jugador. |
| Equipo/Jugador expulsado o dado de baja | `TOURNAMENT_PLAYER_EXPELLED` | Capitán del equipo o Jugador | No | Informativo. |
| Inicio de nueva fase (ej. Octavos, Cuartos) | `TOURNAMENT_STAGE_STARTED` | Todos los equipos participantes | No | Informativo con botón "Ver Torneo". |
| Torneo finalizado y campeón coronado | `TOURNAMENT_WINNER` | Todos los participantes | No | Informativo con botón "Ver Podio". |

* **Dónde inyectar:** En `tournament-inscriptions.service.ts` y `tournaments.service.ts`.

---

### Paso 2: Notificaciones de Equipos (`category: 'TEAM'`)
| Evento | Tipo (`NotificationType`) | Destinatario | Requiere Acción | Acción al Responder |
| :--- | :--- | :--- | :--- | :--- |
| Capitán invita a un jugador a su equipo | `TEAM_INVITATION` | Jugador invitado | **Sí** | Aceptar añade el jugador a la lista de miembros de `team.players`. |
| Jugador solicita unirse a un equipo | `TEAM_JOIN_REQUEST` | Capitán del equipo | **Sí** | Aceptar incorpora al jugador al equipo. |
| Nuevo integrante se sumó al equipo | `TEAM_PLAYER_JOINED` | Todos los miembros del equipo | No | Informativo. |
| Jugador dado de baja del equipo | `TEAM_PLAYER_REMOVED` | Jugador removido | No | Informativo. |

* **Dónde inyectar:** En `teams.service.ts` y en la lógica de invitación de jugadores.

---

### Paso 3: Notificaciones de Partidos (`category: 'MATCH'`)
| Evento | Tipo (`NotificationType`) | Destinatario | Requiere Acción |
| :--- | :--- | :--- | :--- |
| Partido programado o cambio de cancha/hora | `MATCH_SCHEDULE_UPDATED` | Capitanes de ambos equipos | No (Informativo). |
| Recordatorio previo (ej. 2 horas antes del partido) | `MATCH_STARTING_SOON` | Jugadores de ambos equipos | No (Informativo). |
| Resultado oficial cargado y validado | `MATCH_RESULT_CONFIRMED` | Jugadores de ambos equipos | No (Informativo con marcador). |

* **Dónde inyectar:** En `matches.service.ts`.

---

### Paso 4: Lógica de Negocio en `respondAction` (Backend)
En [notifications.service.ts](file:///c:/Users/Armando/Documents/GitHub/winnix-backend/src/notifications/notifications.service.ts), dentro del método `respondAction`:
* Actualmente marca el registro como `ACCEPTED` o `REJECTED`.
* **Falta:** Ejecutar el cambio en la entidad de destino:
  * Si el tipo es `TEAM_INVITATION` o `TEAM_JOIN_REQUEST` y la acción es `ACCEPT`, invocar `TeamsService.addPlayerToTeam(teamId, playerId)`.
  * Si el tipo es `TOURNAMENT_TEAM_JOIN_REQUEST` y la acción es `ACCEPT`, cambiar el estado de la inscripción a `APPROVED`.

---

### Paso 5: Notificaciones Push Remotas (Fase de Producción)
Cuando se genere el build nativo de producción (`EAS Build` o Android/iOS standalone):
1. Descomentar en `native-notifications.adapter.ts` las llamadas a `Notifications.scheduleNotificationAsync` y `Notifications.getExpoPushTokenAsync`.
2. Guardar el `pushToken` en el schema de `User` en backend.
3. Emitir notificaciones remotas vía Expo Push API cuando el usuario no tenga la app abierta.

---

## 6. Resumen de Buenas Prácticas Aplicadas

1. **Eficiencia en MongoDB:**
   * La colección `notifications` nunca crecerá indefinidamente gracias al índice TTL de 30 días.
   * Las consultas de listado y conteo aprovechan índices compuestos `{ recipient: 1, createdAt: -1 }`.
2. **Arquitectura Limpia en React Native:**
   * Las pantallas TSX no realizan peticiones directas. Todo pasa por el hook `useNotifications`.
   * La paginación infinita es transparente y eficiente en memoria.
   * Los modales están desacoplados y listos para ser reutilizados en otros módulos del sistema.
