# CotizaCam API

API REST para sistema de cotizaciones de seguridad electrónica.

## Tecnologías

- Node.js
- Express
- Prisma ORM
- PostgreSQL (Neon)

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno (ya configurado en `.env`):
```
DATABASE_URL="postgresql://neondb_owner:npg_KHAu4jSDL0qQ@ep-young-field-aqw7ve0w-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
PORT=3000
```

3. Generar cliente Prisma:
```bash
npx prisma generate
```

4. Ejecutar migraciones:
```bash
npx prisma migrate dev --name init
```

5. Poblar base de datos:
```bash
npm run prisma:seed
```

## Ejecución

Modo desarrollo:
```bash
npm run dev
```

Modo producción:
```bash
npm start
```

## Endpoints

### Productos
- `GET /api/products` - Listar todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Cotizaciones
- `GET /api/quotations` - Listar todas las cotizaciones
- `GET /api/quotations/:id` - Obtener cotización por ID (con detalles)
- `POST /api/quotations` - Crear cotización con detalles
- `PUT /api/quotations/:id` - Actualizar cotización
- `DELETE /api/quotations/:id` - Eliminar cotización

### Configuración
- `GET /api/settings` - Obtener todas las configuraciones
- `GET /api/settings/:key` - Obtener configuración por key
- `POST /api/settings` - Crear/actualizar configuración

### Salud
- `GET /api/health` - Verificar estado de la API

## Prisma Studio

Para visualizar y editar datos:
```bash
npx prisma studio
```

## Modelos

### Product
- `id` (Int, PK)
- `name` (String)
- `category` (String)
- `price` (Decimal)
- `unit` (String)
- `description` (String?)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Quotation
- `id` (Int, PK)
- `clientName` (String)
- `clientAddress` (String?)
- `clientPhone` (String?)
- `date` (DateTime)
- `total` (Decimal)
- `margin` (Decimal?)
- `status` (String)
- `details` (QuotationDetail[])

### QuotationDetail
- `id` (Int, PK)
- `quotationId` (Int, FK)
- `productId` (Int, FK)
- `quantity` (Int)
- `unitPrice` (Decimal)
- `subtotal` (Decimal)
- `quotation` (Quotation)
- `product` (Product)

### Setting
- `id` (Int, PK)
- `key` (String, unique)
- `value` (String)
