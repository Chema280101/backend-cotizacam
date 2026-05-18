const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Poblando base de datos...');

  // Configuraciones por defecto
  const settings = [
    { key: 'technician_name', value: 'Román Balcázar' },
    { key: 'technician_phone', value: '+51 950962663' },
    { key: 'company_name', value: 'Román Balcázar' },
    { key: 'company_contact', value: '+51 950962663' },
    { key: 'cable_meters_per_camera', value: '20' },
    { key: 'connectors_bnc', value: '2' },
    { key: 'connectors_dc', value: '2' },
    { key: 'tarugos_per_camera', value: '4' },
    { key: 'labor_cost_per_camera', value: '150.00' },
    { key: 'igv_percent', value: '18' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('✅ Configuraciones creadas');

  // Productos de ejemplo
  const products = [
    { name: 'Cámara Domo 4MP', category: 'cámara', price: 280.00, unit: 'unidad', description: 'Cámara domo Hikvision 4MP' },
    { name: 'Cámara Bullet 2MP', category: 'cámara', price: 180.00, unit: 'unidad', description: 'Cámara bullet Dahua 2MP' },
    { name: 'DVR 8 Canales', category: 'dvr', price: 450.00, unit: 'unidad', description: 'DVR 8 canales pentahibrido' },
    { name: 'NVR 16 Canales', category: 'dvr', price: 650.00, unit: 'unidad', description: 'NVR 16 canales 4K' },
    { name: 'Cable UTP Cat6', category: 'cable', price: 2.50, unit: 'metro', description: 'Cable UTP Cat6 exterior' },
    { name: 'Conectores BNC', category: 'accesorio', price: 1.50, unit: 'unidad', description: 'Conectores BNC dorados' },
    { name: 'Fuente de poder 12V', category: 'accesorio', price: 45.00, unit: 'unidad', description: 'Fuente 12V 5A' },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: products.indexOf(product) + 1 },
      update: {},
      create: product,
    });
  }
  console.log('✅ Productos de ejemplo creados');

  console.log('✨ Base de datos poblada exitosamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
