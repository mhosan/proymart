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
    
