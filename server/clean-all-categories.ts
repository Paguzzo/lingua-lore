import { storage } from './index';

async function cleanAllCategories() {
  console.log('🧹 Limpando todas as categorias...');
  
  try {
    const categories = await storage.getCategories();
    console.log(`📊 Total de categorias encontradas: ${categories.length}`);
    
    for (const category of categories) {
      console.log(`🗑️ Removendo categoria: ${category.name} (${category.slug})`);
      await storage.deleteCategory(category.id);
    }
    
    const remainingCategories = await storage.getCategories();
    console.log(`📋 Categorias restantes: ${remainingCategories.length}`);
    console.log('✅ Limpeza concluída!');
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error);
  }
}

cleanAllCategories().then(() => {
  console.log('🏁 Script finalizado');
  process.exit(0);
});