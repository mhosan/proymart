## Notas de instalación
- Instalar libreria DHTML Gantt:
```powershell
   npm install dhtmlx-gantt --save
```
- Crear un nuevo componente para el Gant:
```powershell
   ng generate component gantt --skip-tests
```
- Crear un modelo de datos para las tareas:
```powershell
   ng generate class models/task --skip-tests
```
**Modelo de datos:**
```typescript
    export class Task {  
        id!: number;  
        start_date!: string;  
        text!: string;  
        progress!: number;  
        duration!: number;  
        parent!: number;  
        }  
```
- Crear un modelo de datos para los links:
```powershell
   ng generate class models/link --skip-tests
```
**Modelo de datos:**
```typescript
    export class Link {
        id!: number;
        source!: number;
        target!: number;
        type!: string;
        } 
```
- Crear un servicio para las tareas:
```powershell
   ng generate service services/task --skip-tests
```
- Crear un servicio para los links:
```powershell
   ng generate service services/link --skip-tests
```
- Instalar la libreria de Angular para emular un backend:
```powershell
   npm install angular-in-memory-web-api --save
```
- Crear un servicio para gestionar datos en memoria:
```powershell
   ng generate service services/in-memory-data --flat --skip-tests
```


